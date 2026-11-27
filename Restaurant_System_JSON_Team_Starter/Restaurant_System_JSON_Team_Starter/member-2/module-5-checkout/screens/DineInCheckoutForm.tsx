"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Cart, CheckoutInput, CheckoutPreview, SubmitOrderOutput } from '@/shared/types';
import { getCart } from '../functions/getCart';
import { previewCheckout } from '../functions/previewCheckout';
import { submitOrder } from '@/member-2/module-4-orders/functions/submitOrder';

const rm = (sen: number) => `RM ${(sen / 100).toFixed(2)}`;
export default function DineInCheckoutForm() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pickup, setPickup] = useState('14:30');
  const [payment, setPayment] = useState<CheckoutInput['paymentMethod']>('online_banking');
  const [voucher, setVoucher] = useState('');
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [placed, setPlaced] = useState<SubmitOrderOutput | null>(null);
  const [requestId, setRequestId] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('cart');
    if (!id) { setMessage('Open your cart first.'); return; }
    setRequestId(crypto.randomUUID());
    void getCart(id).then(r => { if (r.ok && r.data) { setCart(r.data); if (r.data.mode === 'dine_in') setPayment('counter'); }
      else setMessage(r.ok ? 'Cart not found.' : r.error.message); });
  }, []);
  const input = (): CheckoutInput => ({ cartId: cart!.id, checkoutRequestId: requestId,
    contactName: name, contactPhone: cart?.mode === 'dine_in' ? null : phone,
    deliveryAddress: cart?.mode === 'delivery' ? address : null, pickupTime: cart?.mode === 'pickup' ? pickup : null,
    paymentMethod: cart?.mode === 'dine_in' ? 'counter' : payment,
    voucherCode: voucher.trim() ? voucher.trim() : null, customerVoucherId: null });
  const submit = async (send: boolean) => {
    if (!cart) return;
    setBusy(true); setMessage('');
    try {
      if (send) {
        const res = await submitOrder(input());
        if (res.ok) { setPlaced(res.data); setPreview(null); }
        else setMessage(res.error.message);
      } else {
        const res = await previewCheckout(input());
        if (res.ok) setPreview(res.data); else setMessage(res.error.message);
      }
    } catch { setMessage('Checkout could not be completed.'); }
    finally { setBusy(false); }
  };
  if (placed) return <section className="panel stack"><p className="eyebrow">Module 4</p><h1>Order placed!</h1>
    <p className="notice">Your order is now Pending. Order ID: <code>{placed.order.id}</code></p>
    <p>Total: <strong>{rm(placed.order.totalSen)}</strong></p>
    <Link className="button" href={'/order-status?order='+encodeURIComponent(placed.order.id)+'&token='+encodeURIComponent(placed.guestTrackingToken || '')}>Track order</Link>
    <Link href="/restaurants">Back to restaurants</Link>
  </section>;
  return <section className="stack"><p className="eyebrow">Module 5 · Checkout</p><h1>Checkout</h1>
    {!cart ? <p className="notice notice-warning">{message || 'Loading cart...'}</p> : <div className="panel stack">
      <h2>{cart.mode.replace('_','-')} details</h2>
      <p>{cart.lines.length} selected items · {cart.mode === 'dine_in' ? 'Pay at counter' : 'Simulated payment (demo only)'}</p>
      <label>Contact name <input className="field" value={name} maxLength={100} onChange={e => setName(e.target.value)} /></label>
      {cart.mode !== 'dine_in' && <label>Phone number<input className="field" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0123456789" /></label>}
      {cart.mode === 'delivery' && <label>Delivery address<textarea className="field" rows={3} value={address} maxLength={300} onChange={e => setAddress(e.target.value)} /></label>}
      {cart.mode === 'pickup' && <label>Requested pickup time<input className="field" type="time" value={pickup} onChange={e => setPickup(e.target.value)} /></label>}
      {cart.mode !== 'dine_in' && <label>Payment method (simulated)<select className="field" value={payment} onChange={e => setPayment(e.target.value as CheckoutInput['paymentMethod'])}>
        <option value="online_banking">Online banking (demo)</option><option value="e_wallet">E-wallet (demo)</option><option value="card">Card (demo)</option></select></label>}
      <label>Restaurant voucher code (registered customers only)<input className="field" value={voucher} maxLength={60} onChange={e => setVoucher(e.target.value)} placeholder="Optional" /></label>
      <button className="button button-secondary" disabled={busy} onClick={() => void submit(false)}>Preview total</button>
      {preview && <div className="panel"><h2>Price summary</h2>
        <p>Subtotal: {rm(preview.subtotalSen)}</p><p>Discount: -{rm(preview.discountSen)}</p>
        <p>Tax: {rm(preview.taxSen)}</p><p>Delivery: {rm(preview.deliveryFeeSen)}</p>
        <p><strong>Total: {rm(preview.totalSen)}</strong></p></div>}
      <button className="button" disabled={busy || !requestId} onClick={() => void submit(true)}>Place order</button>
      <Link href={'/cart?cart='+encodeURIComponent(cart.id)}>Back to cart</Link>
    </div>}
    {message && cart && <p role="alert" className="notice notice-warning">{message}</p>}
  </section>;
}
