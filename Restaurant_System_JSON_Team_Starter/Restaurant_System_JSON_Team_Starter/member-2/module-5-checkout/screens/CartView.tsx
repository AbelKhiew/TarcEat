"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Cart, MenuItem, Restaurant } from '@/shared/types';
import { listPublicRestaurants } from '@/member-1/module-1-onboarding/functions/listPublicRestaurants';
import { listMenuItems } from '@/member-3/module-2-catalog/functions/listMenuItems';
import { createCart } from '../functions/createCart';
import { getCart } from '../functions/getCart';
import { addCartItem } from '../functions/addCartItem';
import { updateCartItem } from '../functions/updateCartItem';
import { removeCartItem } from '../functions/removeCartItem';
import { clearCart } from '../functions/clearCart';

const rm = (sen: number) => `RM ${(sen / 100).toFixed(2)}`;
export default function CartView() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantId, setRestaurantId] = useState('');
  const [mode, setMode] = useState<'dine_in' | 'pickup' | 'delivery'>('pickup');
  const [tableToken, setTableToken] = useState('');
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const restaurant = q.get('restaurant') || '';
    setRestaurantId(restaurant);
    if (q.get('table')) { setMode('dine_in'); setTableToken(q.get('table')!); }
    void listPublicRestaurants().then(r => { if (r.ok) setRestaurants(r.data); });
    const id = q.get('cart');
    if (id) void getCart(id).then(r => {
      if (r.ok && r.data) { setCart(r.data); setRestaurantId(r.data.restaurantId);
        setMode(r.data.mode); setTableToken(r.data.tableToken || ''); }
      else setMessage(r.ok ? 'Cart was not found.' : r.error.message);
    });
  }, []);
  useEffect(() => {
    if (!restaurantId) { setMenu([]); return; }
    void listMenuItems(restaurantId).then(r => { setMenu(r.ok ? r.data : []); if (!r.ok) setMessage(r.error.message); });
  }, [restaurantId]);
  const updatePage = (next: Cart) => {
    setCart(next);
    const q = new URLSearchParams({ cart: next.id });
    window.history.replaceState(null, '', '/cart?' + q.toString());
  };
  const perform = async (fn: () => Promise<{ ok: true; data: Cart } | { ok: false; error: { message: string } }>) => {
    setBusy(true); setMessage('');
    try { const result = await fn(); if (result.ok) updatePage(result.data); else setMessage(result.error.message); }
    catch { setMessage('The request could not be completed.'); }
    finally { setBusy(false); }
  };
  const subtotal = cart?.lines.reduce((sum, line) => sum + (menu.find(m => m.id === line.itemId)?.priceSen || 0) * line.quantity, 0) || 0;
  return <div className="stack">
    <div><p className="eyebrow">Module 5 · Shopping Cart</p><h1>Your food cart</h1><p className="muted">Choose one restaurant and check your items before checkout.</p></div>
    <section className="panel stack">
      <h2>1. Order details</h2>
      <label>Restaurant<select className="field" value={restaurantId} disabled={!!cart} onChange={e => setRestaurantId(e.target.value)}>
        <option value="">Select a restaurant</option>{restaurants.map(x => <option value={x.id} key={x.id}>{x.name}</option>)}</select></label>
      <label>Order method<select className="field" value={mode} disabled={!!cart} onChange={e => setMode(e.target.value as typeof mode)}>
        <option value="pickup">Self-pickup</option><option value="delivery">Delivery</option><option value="dine_in">Dine-in QR</option></select></label>
      {mode === 'dine_in' && <label>Table QR token<input className="field" value={tableToken} disabled={!!cart} onChange={e => setTableToken(e.target.value)} placeholder="Scan your table QR or enter token" /></label>}
      {!cart ? <button className="button" disabled={!restaurantId || busy} onClick={() => void perform(() => createCart({ restaurantId, mode, tableToken: mode === 'dine_in' ? tableToken : null }))}>Start cart</button>
        : <p className="notice">Cart started · {cart.mode.replace('_','-')} · Restaurant {restaurants.find(x => x.id === cart.restaurantId)?.name || cart.restaurantId}</p>}
    </section>
    {cart && <>
      <section className="stack"><h2>2. Browse items</h2><label>Special request for the next item<input className="field" value={note} maxLength={250} onChange={e => setNote(e.target.value)} placeholder="Less ice, no onions, etc." /></label>
        <div className="grid">{menu.filter(item => !item.archivedAt).map(item => <article className="panel stack" key={item.id}>
          <h3>{item.name}</h3><p>{item.description}</p><p><b>{rm(item.priceSen)}</b></p>
          <button className="button" disabled={busy || !item.isAvailable} onClick={() => void perform(() => addCartItem(cart.id, { itemId: item.id, quantity: 1, note }))}>{item.isAvailable ? 'Add to cart' : 'Sold out'}</button>
        </article>)}</div>
      </section>
      <section className="panel stack"><h2>3. Your items</h2>
        {cart.lines.length === 0 && <p className="muted">Your cart is empty. Add something from the menu.</p>}
        {cart.lines.map(line => {
          const item = menu.find(x => x.id === line.itemId);
          return <div className="panel stack" key={line.id}>
            <strong>{item?.name || 'Menu item'} — {rm((item?.priceSen || 0) * line.quantity)}</strong>
            <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:12}}>
              <label>Quantity <input className="field" aria-label="Quantity" type="number" min={1} max={99} defaultValue={line.quantity} key={line.id+'q'+line.quantity} id={'qty-'+line.id} style={{width:95}} /></label>
              <label>Note <input className="field" aria-label="Note" defaultValue={line.note} maxLength={250} key={line.id+'n'+line.note} id={'note-'+line.id} /></label>
              <button className="button button-secondary" disabled={busy} onClick={() => void perform(() => updateCartItem(cart.id, line.id, {
                quantity: Number((document.getElementById('qty-'+line.id) as HTMLInputElement).value),
                note: (document.getElementById('note-'+line.id) as HTMLInputElement).value,
              }))}>Update</button>
              <button className="button button-secondary" disabled={busy} onClick={() => void perform(() => removeCartItem(cart.id, line.id))}>Remove</button>
            </div>
          </div>;
        })}
        <p><strong>Estimated subtotal: {rm(subtotal)}</strong> <span className="muted">(final price is checked again on server)</span></p>
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          <button className="button button-secondary" disabled={busy || !cart.lines.length} onClick={() => void perform(() => clearCart(cart.id))}>Clear cart</button>
          <Link className="button" href={'/checkout?cart=' + encodeURIComponent(cart.id)}>Continue to checkout</Link>
        </div>
      </section>
    </>}
    {message && <p role="alert" className="notice notice-warning">{message}</p>}
  </div>;
}
