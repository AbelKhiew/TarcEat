"use client";
import { useState } from 'react';
import type { Order } from '@/shared/types';
import { updateOrderStatus } from '../functions/updateOrderStatus';
import { completeTakeawayOrder } from '../functions/completeTakeawayOrder';
export default function OrderStatusControls({order,onChange}: {order: Order;onChange?: (order:Order)=>void}) {
 const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 const next=order.status==='pending'?'preparing':order.status==='preparing'?'ready':order.status==='ready'&&order.mode!=='dine_in'?'completed':null;
 const change=async()=>{if(!next)return;setBusy(true);
 const res=next==='completed'?await completeTakeawayOrder(order.id):await updateOrderStatus(order.id,next);
 if(res.ok){setError('');onChange?.(res.data);}else setError(res.error.message);
 setBusy(false);};
 return <div className="stack">{next&&<button className="button" disabled={busy||order.cancellationStatus==='requested'} onClick={()=>void change()}>Move to {next}</button>}
 {order.mode==='dine_in'&&order.status==='ready'&&<p>Finish this order with the whole table invoice.</p>}
 {error&&<p role="alert" className="notice notice-warning">{error}</p>}</div>;
}
