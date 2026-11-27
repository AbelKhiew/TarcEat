"use client";
import Link from 'next/link';
import './orderAlert.css';
import { useEffect, useRef, useState } from 'react';
import type { Order, Restaurant, OrderStatus } from '@/shared/types';
import { listMyRestaurants } from '@/member-1/module-1-onboarding/functions/listMyRestaurants';
import { listRestaurantOrders } from '../functions/listRestaurantOrders';
import { updateOrderStatus } from '../functions/updateOrderStatus';
import { completeTakeawayOrder } from '../functions/completeTakeawayOrder';
import { decideCancellation } from '../functions/decideCancellation';
import { archiveOrder } from '../functions/archiveOrder';

const money = (sen: number) => `RM ${(sen/100).toFixed(2)}`;
export default function KitchenQueue() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantId, setRestaurantId] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [alertIds, setAlertIds] = useState<string[]>([]);
  const [sound, setSound] = useState(false);
  const knownIds = useRef(new Set<string>());
  const audio = useRef<AudioContext | null>(null);
  const initialized = useRef(false);
  useEffect(() => {
    void listMyRestaurants().then(r => {
      if (!r.ok) { setMessage(r.error.message); return; }
      setRestaurants(r.data);
      if (r.data[0]) setRestaurantId(r.data[0].id);
    });
  }, []);
  useEffect(() => { knownIds.current.clear(); initialized.current = false; setOrders([]); setAlertIds([]); }, [restaurantId]);
  useEffect(() => {
    if (!restaurantId) return;
    let active = true;
    async function refresh() {
      const res = await listRestaurantOrders(restaurantId);
      if (!active) return;
      if (!res.ok) { setMessage(res.error.message); return; }
      const pending = res.data.filter(order => order.status === 'pending');
      if (initialized.current) {
        const fresh = pending.filter(order => !knownIds.current.has(order.id));
        if (fresh.length) {
          setAlertIds(fresh.map(order => order.id));
          setTimeout(() => { if (active) setAlertIds([]); }, 9000);
          if (sound && audio.current) {
            try { const ctx = audio.current; const oscillator = ctx.createOscillator(); const gain = ctx.createGain();
              oscillator.frequency.value = 720; gain.gain.value = 0.09;
              oscillator.connect(gain); gain.connect(ctx.destination); oscillator.start();
              oscillator.stop(ctx.currentTime + 0.23);
            } catch { /* Sound can be blocked; the banner still works. */ }
          }
        }
      }
      pending.forEach(order => knownIds.current.add(order.id));
      initialized.current = true;
      setOrders(res.data);
    }
    void refresh();
    const handle = setInterval(() => { void refresh(); }, 4000);
    return () => { active = false; clearInterval(handle); };
  }, [restaurantId, sound]);
  const toggleSound = async () => {
    if (sound) { setSound(false); return; }
    try {
      audio.current ??= new AudioContext();
      await audio.current.resume();
      setSound(true);
    } catch { setMessage('Browser blocked sound. Visual alerts will still work.'); }
  };
  const run = async (action: () => Promise<{ok:true;data:unknown}|{ok:false;error:{message:string}}>) => {
    setBusy(true); setMessage('');
    try { const res = await action(); if (!res.ok) setMessage(res.error.message);
      else { setMessage('Saved successfully.'); if (restaurantId) {
        const next = await listRestaurantOrders(restaurantId); if (next.ok) setOrders(next.data);
      } } }
    catch { setMessage('Cannot update this order.'); }
    finally { setBusy(false); }
  };
  return <section className="stack"><p className="eyebrow">Module 4 · Restaurant Owner</p><h1>Kitchen Order Queue</h1>
    <p className="muted">Orders: Pending → Preparing → Ready. Pickup and delivery can then be completed.</p>
    <div className="panel stack"><label>My restaurant<select className="field" value={restaurantId} onChange={e => setRestaurantId(e.target.value)}>
      {restaurants.length === 0 && <option value="">Sign in as restaurant owner</option>}
      {restaurants.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      <button className="button button-secondary" onClick={() => void toggleSound()}>{sound ? 'Disable' : 'Enable'} sound notification</button>
      <p className="muted">Current JSON demonstration checks every 4 seconds. Supabase Realtime will replace this after team integration.</p>
    </div>
    {alertIds.length > 0 && <div className="notice tarceat-alert" role="alert"><strong>🔔 New Pending order received! ({alertIds.length})</strong></div>}
    {message && <p className="notice" role="status">{message}</p>}
    <div className="grid">{orders.map(order => <article className="panel stack" key={order.id}>
      <span className="badge">{order.status.toUpperCase()}</span>
      <b>Order {order.id.slice(0,8)}</b>
      <p>{order.mode.replace('_','-')} · {order.contactName} · {money(order.totalSen)}</p>
      <p className="muted">Payment: {order.paymentStatus} · Cancellation: {order.cancellationStatus}</p>
      {order.cancellationStatus === 'requested' && <div className="stack notice notice-warning">
        <strong>Cancellation requested</strong><p>{order.cancellationReason}</p>
        <div style={{display:'flex',gap:8}}><button className="button" disabled={busy} onClick={() => void run(() => decideCancellation(order.id,true))}>Approve</button>
          <button className="button button-secondary" disabled={busy} onClick={() => void run(() => decideCancellation(order.id,false))}>Reject</button></div>
      </div>}
      {(['pending','preparing'] as OrderStatus[]).includes(order.status) && <button className="button" disabled={busy || order.cancellationStatus === 'requested'}
        onClick={() => void run(() => updateOrderStatus(order.id, order.status === 'pending' ? 'preparing' : 'ready'))}>
          Move to {order.status === 'pending' ? 'Preparing' : 'Ready'}</button>}
      {order.status === 'ready' && order.mode !== 'dine_in' && <button className="button" disabled={busy}
        onClick={() => void run(() => completeTakeawayOrder(order.id))}>Mark Completed</button>}
      {order.status === 'ready' && order.mode === 'dine_in' && <Link href="/owner/invoices">Finish at table invoice</Link>}
      {['completed','cancelled'].includes(order.status) && <button className="button button-secondary" disabled={busy} onClick={() => void run(() => archiveOrder(order.id))}>Archive</button>}
    </article>)}</div>
    {!orders.length && <div className="panel"><p>No orders for this restaurant yet.</p></div>}
    <div style={{display:'flex',gap:16,flexWrap:'wrap'}}><Link href="/owner/invoices">Table invoices</Link><Link href="/owner/cancellations">Cancellation requests</Link><Link href="/owner/receipts">Receipts</Link></div>
  </section>;
}
