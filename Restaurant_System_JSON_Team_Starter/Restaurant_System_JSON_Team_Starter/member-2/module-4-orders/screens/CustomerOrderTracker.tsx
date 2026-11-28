"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { OrderDetails } from '@/shared/types';
import { getOrder } from '../functions/getOrder';
import { requestCancellation } from '../functions/requestCancellation';
export default function CustomerOrderTracker() {
  const [orderId, setOrderId] = useState(''); const [token, setToken] = useState('');
  const [reason, setReason] = useState(''); const [details, setDetails] = useState<OrderDetails|null>(null);
  const [message, setMessage] = useState('');
  useEffect(() => { const q = new URLSearchParams(window.location.search);
    setOrderId(q.get('order') || ''); setToken(q.get('token') || ''); }, []);
  useEffect(() => { if (!orderId) return; let active=true;
    const refresh = async () => { const res = await getOrder({ orderId, guestTrackingToken: token || null });
      if (!active) return; if (res.ok) setDetails(res.data); else setMessage(res.error.message); };
    void refresh(); const timer = setInterval(() => { void refresh(); },4000);
    return () => { active=false; clearInterval(timer); }; }, [orderId,token]);
  const cancel = async () => { const res = await requestCancellation({orderId,guestTrackingToken:token||null,reason});
    setMessage(res.ok ? 'Cancellation request sent to the restaurant owner.' : res.error.message);
    if (res.ok) setDetails(v => v ? {...v,order:res.data}:v); };
  return <section className="stack"><h1>Track your order</h1><p className="muted">Your order status updates automatically while this page is open.</p>
    <div className="panel stack"><label>Order ID<input className="field" value={orderId} onChange={e => setOrderId(e.target.value)}/></label>
      <label>Guest tracking token (if ordering as guest)<input className="field" value={token} onChange={e => setToken(e.target.value)}/></label>
      {details && <><span className="badge">{details.order.status.toUpperCase()}</span>
        <p>Mode: {details.order.mode.replace('_','-')} · Total: RM {(details.order.totalSen/100).toFixed(2)}</p>
        {details.items.map(item => <p key={item.id}>{item.quantity} × {item.itemName} — RM {(item.lineTotalSen/100).toFixed(2)}</p>)}
        <p>Cancellation: {details.order.cancellationStatus}</p>
        {details.order.status === 'pending' && details.order.cancellationStatus !== 'requested' &&
          <><label>Why cancel?<input className="field" maxLength={250} value={reason} onChange={e=>setReason(e.target.value)}/></label>
            <button className="button button-secondary" disabled={!reason.trim()} onClick={() => void cancel()}>Request cancellation</button></>}
      </>}
      {message && <p role="status" className="notice notice-warning">{message}</p>}
    </div><Link href="/restaurants">Browse restaurants</Link></section>;
}
