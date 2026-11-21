import Link from 'next/link';
import { validateTableToken } from '../functions/validateTableToken';
export default async function QrEntryPrompt({ token, guest }: { token: string; guest: boolean }) {
  const response = await validateTableToken(token);
  if (!response.ok) return <p className="notice notice-error">{response.error.message}</p>;
  const { table, restaurant } = response.data;
  if (restaurant.status !== 'active' || !restaurant.isOpen) {
    return <p className="notice">New orders are unavailable at {restaurant.name}.</p>;
  }
  const query = new URLSearchParams({ table: token });
  return <section className="panel stack"><h1>{restaurant.name} · Table {table.tableNumber}</h1>
    {guest ? <p className="notice">Table verified. The customer menu and ordering will become available when Modules 2, 4 and 5 are connected.</p>
      : <><p>Your table is verified. A session opens when the first order is placed.</p>
        <Link className="button" href={`/menu?${query}&guest=1`}>Continue as guest</Link>
        <Link href="/register/customer">Customer registration (Module 6)</Link></>}
  </section>;
}
