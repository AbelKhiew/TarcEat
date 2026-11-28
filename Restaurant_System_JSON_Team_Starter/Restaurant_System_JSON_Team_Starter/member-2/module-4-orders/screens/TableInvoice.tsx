"use client";
import Link from 'next/link';
import { useState } from 'react';
import type { TableInvoice as Invoice, Receipt } from '@/shared/types';
import { getTableInvoice } from '../functions/getTableInvoice';
import { finishTableVisit } from '../functions/finishTableVisit';
export default function TableInvoice() {
  const [token,setToken]=useState(''); const [invoice,setInvoice]=useState<Invoice|null>(null);
  const [receipt,setReceipt]=useState<Receipt|null>(null); const [message,setMessage]=useState('');
  const search = async()=>{const r=await getTableInvoice(token); if(r.ok){setInvoice(r.data);setMessage('');}else setMessage(r.error.message);};
  const finish = async()=>{if(!invoice)return;const r=await finishTableVisit(invoice.visit.id);
    if(r.ok){setReceipt(r.data);setMessage('Payment recorded and table closed.');setInvoice(null);}else setMessage(r.error.message);};
  return <section className="stack"><p className="eyebrow">Module 4 · Dine-in</p><h1>Combined table invoice</h1>
    <div className="panel stack"><label>Table QR token<input className="field" placeholder="demo-jade-table-001" value={token} onChange={e=>setToken(e.target.value)}/></label>
      <button className="button button-secondary" onClick={()=>void search()}>View table bill</button>
      {invoice && <><p>Open visit: {invoice.visit.id}</p>
        {invoice.orders.map(o=><p key={o.id}>Order {o.id.slice(0,8)} — {o.status} — RM {(o.totalSen/100).toFixed(2)}</p>)}
        <p>Subtotal: RM {(invoice.subtotalSen/100).toFixed(2)}</p><p>Discount: RM {(invoice.discountSen/100).toFixed(2)}</p>
        <p>Tax: RM {(invoice.taxSen/100).toFixed(2)}</p><h2>Grand total: RM {(invoice.totalSen/100).toFixed(2)}</h2>
        <p className="muted">Owner: check payment at the counter. All remaining orders must be Ready.</p>
        <button className="button" onClick={()=>void finish()}>Finish / Paid</button></>}
      {receipt && <p className="notice">Receipt {receipt.receiptNumber} created. Total: RM {(receipt.totalSen/100).toFixed(2)}</p>}
      {message && <p role="status" className="notice">{message}</p>}
    </div><Link href="/owner/orders">Back to kitchen queue</Link>
  </section>;
}
