import { connection } from 'next/server';
import Link from 'next/link';
import { listPointTransactions } from '../functions/listPointTransactions';
import PointsBalance from './PointsBalance';

const labels = {
  opening_balance: 'Opening balance', order_completion: 'Completed order',
  voucher_claim: 'Voucher claim', adjustment: 'Adjustment',
};

export default async function PointsHistory() {
  await connection();
  const response = await listPointTransactions();
  return <section className="panel stack">
    <Link href="/account">My account</Link>
    <h1>Loyalty points</h1>
    {!response.ok ? <p role="alert" className="notice notice-error">{response.error.message}</p> : <>
      <PointsBalance />
      {response.data.length ? <table className="data-table">
        <thead><tr><th>Date</th><th>Activity</th><th>Points</th></tr></thead>
        <tbody>{response.data.map(entry => <tr key={entry.id}>
          <td>{new Date(entry.createdAt).toLocaleDateString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}</td>
          <td>{labels[entry.type]}</td>
          <td>{entry.pointsDelta > 0 ? '+' : ''}{entry.pointsDelta}</td>
        </tr>)}</tbody>
      </table> : <p className="muted">No points activity yet.</p>}
    </>}
  </section>;
}
