"use client";
import type { PaymentMethod } from '@/shared/types';
export default function SimulatedPaymentSection({value,onChange}: {value:PaymentMethod;onChange:(method:PaymentMethod)=>void}) {
 return <label>Payment (simulation only)<select className="field" value={value} onChange={e=>onChange(e.target.value as PaymentMethod)}>
 <option value="online_banking">Online banking demo</option><option value="e_wallet">E-wallet demo</option><option value="card">Card demo</option></select></label>;
}
