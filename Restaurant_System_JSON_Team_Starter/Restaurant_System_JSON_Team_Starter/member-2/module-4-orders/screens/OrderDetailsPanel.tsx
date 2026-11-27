"use client";
import type { Order, OrderItem } from '@/shared/types';
export default function OrderDetailsPanel({order,items}: {order: Order;items: OrderItem[]}) {
 return <section className="panel stack"><h2>Order {order.id.slice(0,8)}</h2>
 <span className="badge">{order.status.toUpperCase()}</span><p>{order.mode.replace('_','-')} · {order.contactName}</p>
 <ul>{items.map(item=><li key={item.id}>{item.quantity} × {item.itemName} — RM {(item.lineTotalSen/100).toFixed(2)} {item.note&&<em>({item.note})</em>}</li>)}</ul>
 <p><strong>Total: RM {(order.totalSen/100).toFixed(2)}</strong></p></section>;
}
