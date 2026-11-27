"use client";
import { useState } from 'react';
import type { Cart, CartLine } from '@/shared/types';
import { updateCartItem } from '../functions/updateCartItem';
import { removeCartItem } from '../functions/removeCartItem';
export default function CartLineEditor({cart,line,onChange}: {cart:Cart;line:CartLine;onChange:(cart:Cart)=>void}) {
 const [quantity,setQuantity]=useState(line.quantity);const [note,setNote]=useState(line.note);const [message,setMessage]=useState('');
 const save=async()=>{const r=await updateCartItem(cart.id,line.id,{quantity,note});if(r.ok){onChange(r.data);setMessage('Saved');}else setMessage(r.error.message);};
 const remove=async()=>{const r=await removeCartItem(cart.id,line.id);if(r.ok)onChange(r.data);else setMessage(r.error.message);};
 return <div className="panel stack"><label>Quantity<input className="field" type="number" min={1} max={99} value={quantity} onChange={e=>setQuantity(Number(e.target.value))}/></label>
 <label>Special request<input className="field" maxLength={250} value={note} onChange={e=>setNote(e.target.value)}/></label>
 <div><button className="button" onClick={()=>void save()}>Update</button>{' '}
 <button className="button button-secondary" onClick={()=>void remove()}>Remove</button></div>{message&&<p role="status">{message}</p>}</div>;
}
