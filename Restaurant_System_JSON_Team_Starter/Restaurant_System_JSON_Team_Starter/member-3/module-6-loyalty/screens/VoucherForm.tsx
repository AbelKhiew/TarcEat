'use client';

import type { FormEvent } from 'react';
import type { Voucher, VoucherInput } from '@/shared/types';

export default function VoucherForm({ restaurantId, voucher, busy, save, cancel }: {
  restaurantId: string | null;
  voucher: Voucher | null;
  busy: boolean;
  save: (input: VoucherInput) => Promise<boolean>;
  cancel: () => void;
}) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const discountSen = Math.round(Number(data.get('discount')) * 100);
    const minimumSpendSen = Math.round(Number(data.get('minimum')) * 100);
    const expiry = String(data.get('expiry'));
    const originalDate = voucher ? new Date(Date.parse(voucher.expiresAt) + 8 * 3600000).toISOString().slice(0, 10) : '';
    const expiresAt = voucher && expiry === originalDate ? voucher.expiresAt : new Date(expiry + 'T23:59:59+08:00').toISOString();
    const saved = await save({
      restaurantId, code: String(data.get('code')), discountSen, minimumSpendSen, expiresAt,
      pointsCost: Number(data.get('points')), usesPerClaim: Number(data.get('usesPerClaim')),
      perCustomerUseLimit: data.get('perCustomer') ? Number(data.get('perCustomer')) : null,
      totalUseLimit: data.get('total') ? Number(data.get('total')) : null,
      claimEnabled: data.has('claimEnabled'), isUsable: data.has('isUsable'),
    });
    if (saved && !voucher) form.reset();
  }

  const expiryDate = voucher ? new Date(Date.parse(voucher.expiresAt) + 8 * 3600000).toISOString().slice(0, 10) : '';
  return <form className="panel stack" onSubmit={submit}>
    <h2>{voucher ? 'Edit voucher' : 'Create voucher'}</h2>
    <div className="grid">
      <label>Code <input className="field" name="code" required minLength={2} maxLength={30} defaultValue={voucher?.code} /></label>
      <label>Discount (RM) <input className="field" name="discount" type="number" min="0.01" step="0.01" required defaultValue={voucher ? voucher.discountSen / 100 : undefined} /></label>
      <label>Minimum spend (RM) <input className="field" name="minimum" type="number" min="0" step="0.01" required defaultValue={(voucher?.minimumSpendSen ?? 0) / 100} /></label>
      <label>Expiry date (Malaysia time) <input className="field" name="expiry" type="date" required defaultValue={expiryDate} /></label>
      <label>Points cost <input className="field" name="points" type="number" min="0" required defaultValue={voucher?.pointsCost ?? 0} /></label>
      <label>Uses per claim <input className="field" name="usesPerClaim" type="number" min="1" required defaultValue={voucher?.usesPerClaim ?? 1} /></label>
      <label>Total use limit <input className="field" name="total" type="number" min="1" defaultValue={voucher?.totalUseLimit ?? ''} placeholder="Unlimited" /></label>
      <label>Use limit per customer <input className="field" name="perCustomer" type="number" min="1" defaultValue={voucher?.perCustomerUseLimit ?? ''} placeholder="Unlimited" /></label>
    </div>
    <label><input type="checkbox" name="claimEnabled" defaultChecked={voucher?.claimEnabled ?? true} /> Accept new claims</label>
    <label><input type="checkbox" name="isUsable" defaultChecked={voucher?.isUsable ?? true} /> Allow voucher use</label>
    <div><button className="button" disabled={busy}>Save voucher</button>{' '}
      {voucher && <button type="button" className="button-secondary" disabled={busy} onClick={cancel}>Cancel</button>}
    </div>
  </form>;
}
