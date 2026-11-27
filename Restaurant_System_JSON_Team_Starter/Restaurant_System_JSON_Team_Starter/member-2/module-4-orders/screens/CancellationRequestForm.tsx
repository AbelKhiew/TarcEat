"use client";
import { useState } from 'react';
import { requestCancellation } from '../functions/requestCancellation';
export default function CancellationRequestForm({orderId,guestTrackingToken}: {orderId:string;guestTrackingToken:string|null}) {
 const [reason,setReason]=useState('');const [message,setMessage]=useState('');
 const submit=async()=>{const res=await requestCancellation({orderId,guestTrackingToken,reason});
 setMessage(res.ok?'Your request was sent to the restaurant owner.':res.error.message);};
 return <section className="panel stack"><h2>Request cancellation</h2>
 <label>Reason<input className="field" maxLength={250} value={reason} onChange={e=>setReason(e.target.value)}/></label>
 <button className="button" disabled={!reason.trim()} onClick={()=>void submit()}>Send request</button>
 {message&&<p role="status">{message}</p>}</section>;
}
