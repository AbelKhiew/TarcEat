import { connection } from 'next/server';
import Link from 'next/link';
import { listMyVouchers } from '../functions/listMyVouchers';
import PlatformOffers from './PlatformOffers';

export default async function ClaimedVoucherList() {
  await connection();
  const response = await listMyVouchers();
  return <section className="panel stack">
    <Link href="/account">My account</Link>
    <h1>My vouchers</h1>
    {!response.ok ? <p role="alert" className="notice notice-error">{response.error.message}</p> : <>
      {response.data.length ? <div className="grid">{response.data.map(claim => <article className="panel stack" key={claim.id}>
        <h2>{claim.voucherId}</h2>
        <p><span className="badge">{claim.status}</span> {Math.max(0, claim.useLimit - claim.usesCount)} uses left</p>
      </article>)}</div> : <p className="muted">No claimed vouchers yet.</p>}
      <PlatformOffers />
    </>}
  </section>;
}