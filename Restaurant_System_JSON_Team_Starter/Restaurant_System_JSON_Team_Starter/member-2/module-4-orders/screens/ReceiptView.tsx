"use client";
import { useState } from 'react';
import type { Receipt } from '@/shared/types';
import { getReceipt } from '../functions/getReceipt';
export default function ReceiptView() {
  const [id,setId]=useState('');const [receipt,setReceipt]=useState<Receipt|null>(null);const [message,setMessage]=useState('');
  const search=async()=>{const r=await getReceipt(id);if(r.ok){setReceipt(r.data);setMessage('');}else setMessage(r.error.message);};
  return <section className="stack"><h1>Order receipt</h1><div className="panel stack">
    <label>Receipt ID<input className="field" value={id} onChange={e=>setId(e.target.value)}/></label>
    <button className="button button-secondary" onClick={()=>void search()}>Load receipt</button>
    {receipt&&<div className="panel"><h2>TarcEat Receipt {receipt.receiptNumber}</h2><p>Issued: {new Date(receipt.issuedAt).toLocaleString()}</p>
      <p>Orders: {receipt.orderIds.map(x=>x.slice(0,8)).join(', ')}</p>
      <p>Subtotal: RM {(receipt.subtotalSen/100).toFixed(2)}</p><p>Tax: RM {(receipt.taxSen/100).toFixed(2)}</p>
      <p>Discount: RM {(receipt.discountSen/100).toFixed(2)}</p><h2>Total: RM {(receipt.totalSen/100).toFixed(2)}</h2>
      <button className="button" onClick={()=>window.print()}>Print</button></div>}
    {message&&<p className="notice notice-warning">{message}</p>}
  </div></section>;
}
