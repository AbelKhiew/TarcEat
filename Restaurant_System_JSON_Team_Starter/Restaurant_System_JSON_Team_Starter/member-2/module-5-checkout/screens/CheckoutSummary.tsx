"use client";
import type { CheckoutPreview } from '@/shared/types';
export default function CheckoutSummary({preview}: {preview:CheckoutPreview}) {
 const rm=(value:number)=>'RM '+(value/100).toFixed(2);
 return <section className="panel stack"><h2>Price summary</h2>
 <p>Subtotal: {rm(preview.subtotalSen)}</p><p>Discount: -{rm(preview.discountSen)}</p>
 <p>Tax: {rm(preview.taxSen)}</p><p>Delivery fee: {rm(preview.deliveryFeeSen)}</p>
 <h2>Total: {rm(preview.totalSen)}</h2></section>;
}
