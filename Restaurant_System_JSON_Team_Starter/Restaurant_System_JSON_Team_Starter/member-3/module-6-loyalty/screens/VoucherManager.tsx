'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSession } from '@/shared/auth/getSession';
import type { Voucher, VoucherInput } from '@/shared/types';
import { createVoucher } from '../functions/createVoucher';
import { listManagedVouchers } from '../functions/listManagedVouchers';
import { updateVoucher } from '../functions/updateVoucher';
import { withdrawVoucher } from '../functions/withdrawVoucher';
import VoucherForm from './VoucherForm';

export default function VoucherManager({ platform }: { platform: boolean }) {
  const [scope, setScope] = useState<string | null>(null);
  const [allowed, setAllowed] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [editing, setEditing] = useState<Voucher | null>(null);
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    const session = await getSession();
    const id = session.ok ? session.data.selectedRestaurantId : null;
    if (!session.ok || session.data.role !== (platform ? 'root_admin' : 'owner') || (!platform && !id)) {
      setMessage(platform ? 'Sign in as Root Admin.' : 'Sign in as an owner and select a restaurant.');
      setBusy(false);
      return;
    }
    const restaurantId = platform ? null : id;
    const response = await listManagedVouchers(restaurantId);
    if (response.ok) {
      setScope(restaurantId);
      setAllowed(true);
      setVouchers(response.data);
    } else setMessage(response.error.message);
    setBusy(false);
  }, [platform]);

  useEffect(() => { void load(); }, [load]);

  async function save(input: VoucherInput) {
    setBusy(true);
    const response = editing ? await updateVoucher(editing.id, input) : await createVoucher(input);
    setMessage(response.ok ? 'Voucher saved.' : response.error.message);
    if (response.ok) { setEditing(null); await load(); }
    else setBusy(false);
    return response.ok;
  }

  async function withdraw(id: string) {
    if (!window.confirm('Stop new claims for this voucher?')) return;
    setBusy(true);
    const response = await withdrawVoucher(id);
    setMessage(response.ok ? 'Voucher withdrawn.' : response.error.message);
    if (response.ok) { setEditing(null); await load(); }
    else setBusy(false);
  }

  return <section className="panel stack">
    <h1>{platform ? 'Platform vouchers' : 'Restaurant vouchers'}</h1>
    {message && <p role="status" className="notice">{message}</p>}
    {busy && <p role="status" className="muted">Loading or saving vouchers…</p>}
    {allowed && <>
      <VoucherForm key={editing?.id ?? 'new'} restaurantId={scope} voucher={editing} busy={busy} save={save} cancel={() => setEditing(null)} />
      {!vouchers.length && <p className="muted">No vouchers yet.</p>}
      <div className="grid">{vouchers.map(voucher => <article className="panel stack" key={voucher.id}>
        <h2>{voucher.code}</h2>
        <p>RM {(voucher.discountSen / 100).toFixed(2)} off</p>
        <p>{voucher.isUsable ? 'Usable' : 'Disabled'} · {voucher.claimEnabled ? 'Claims open' : 'Claims closed'}</p>
        <div><button className="button-secondary" disabled={busy} onClick={() => setEditing(voucher)}>Edit</button>{' '}
          {voucher.claimEnabled && <button className="button-secondary" disabled={busy} onClick={() => void withdraw(voucher.id)}>Withdraw</button>}
        </div>
      </article>)}</div>
    </>}
  </section>;
}