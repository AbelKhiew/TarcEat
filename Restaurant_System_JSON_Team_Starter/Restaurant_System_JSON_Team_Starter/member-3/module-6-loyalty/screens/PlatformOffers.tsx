import { listPlatformOffers } from '../functions/listPlatformOffers';

export default async function PlatformOffers() {
  const response = await listPlatformOffers();
  return <section className="stack">
    <h2>Platform offers</h2>
    {!response.ok ? <p role="alert" className="notice notice-error">{response.error.message}</p> :
      response.data.length ? <div className="grid">{response.data.map(voucher => <article className="panel stack" key={voucher.id}>
        <h3>{voucher.code}</h3>
        <p>RM {(voucher.discountSen / 100).toFixed(2)} off · {voucher.pointsCost} points</p>
        <p className="muted">Minimum spend RM {(voucher.minimumSpendSen / 100).toFixed(2)}</p>
      </article>)}</div> : <p className="muted">No platform offers available.</p>}
    <p className="notice">Claiming offers will be available when points and voucher claims can be saved together.</p>
  </section>;
}