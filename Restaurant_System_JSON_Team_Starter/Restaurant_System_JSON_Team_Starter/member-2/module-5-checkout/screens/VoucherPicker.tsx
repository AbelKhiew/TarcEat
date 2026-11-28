"use client";
export default function VoucherPicker({code,onCodeChange}: {code:string;onCodeChange:(text:string)=>void}) {
 return <label>Restaurant voucher code (signed-in customers)<input className="field" maxLength={60} value={code} onChange={e=>onCodeChange(e.target.value)}/></label>;
}
