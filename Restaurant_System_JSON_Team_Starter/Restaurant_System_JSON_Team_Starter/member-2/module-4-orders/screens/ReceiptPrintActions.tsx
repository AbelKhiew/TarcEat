"use client";
import Link from 'next/link';
export default function ReceiptPrintActions() {
 return <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
 <button className="button" onClick={()=>window.print()}>Print receipt</button>
 <Link className="button button-secondary" href="/restaurants">Done</Link></div>;
}
