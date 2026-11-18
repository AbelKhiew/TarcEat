import Link from 'next/link';
import MemberNavigation from '@/member-1/screens/MemberNavigation';
import { listPublicRestaurants } from '@/member-1/module-1-onboarding/functions/listPublicRestaurants';
export const dynamic = 'force-dynamic';
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const term = typeof q === 'string' ? q.trim().toLowerCase() : '';
  const response = await listPublicRestaurants();
  const rows = response.ok ? response.data.filter(row => (row.name + ' ' + row.address).toLowerCase().includes(term)) : [];
  return <><MemberNavigation /><main className="page stack"><h1>Find a restaurant</h1>
    <form className="stack"><label>Search by name or address<input className="field" name="q" defaultValue={term} /></label><button className="button">Search</button></form>
    {!response.ok && <p role="alert">{response.error.message}</p>}
    {response.ok && rows.length === 0 && <p>No matching restaurants.</p>}
    <div className="grid">{rows.map(restaurant => <article className="panel" key={restaurant.id}>
      <h2>{restaurant.name}</h2><p>{restaurant.address}</p><p>{restaurant.isOpen ? 'Open' : 'Closed'}</p>
      {restaurant.isOpen && <Link href={'/menu?restaurant=' + encodeURIComponent(restaurant.id)}>View menu</Link>}
    </article>)}</div>
  </main></>;
}
