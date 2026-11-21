import { connection } from 'next/server';
import Link from 'next/link';
import { getMyOrderHistory } from '../functions/getMyOrderHistory';

export default async function CustomerOrderHistory() {
  await connection();
  const response = await getMyOrderHistory();
  return <section className="panel stack">
    <Link href="/account">My account</Link>
    <h1>My orders</h1>
    {!response.ok ? <p role="alert" className="notice notice-error">{response.error.message}</p> :
      response.data.length ? <div className="grid">{response.data.map(order => <article className="panel stack" key={order.id}>
        <h2>{order.id}</h2>
        <p>{new Date(order.createdAt).toLocaleDateString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}</p>
        <p><span className="badge">{order.status}</span> RM {(order.totalSen / 100).toFixed(2)}</p>
      </article>)}</div> : <p className="muted">No orders yet.</p>}
  </section>;
}