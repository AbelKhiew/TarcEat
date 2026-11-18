import ActionForm from '@/member-1/screens/ActionForm';
import { getSession } from '@/shared/auth/getSession';
import { selectRestaurant } from '@/shared/auth/selectRestaurant';
import { listMyRestaurants } from '../functions/listMyRestaurants';
import Link from 'next/link';

export default async function RestaurantSwitcher() {
  const [response, session] = await Promise.all([listMyRestaurants(), getSession()]);
  if (!response.ok) return <p className="notice notice-error">{response.error.message}</p>;
  return <div className="stack"><h1>Your restaurants</h1>
    <Link href="/owner/applications">Submit or view restaurant applications</Link>
    {response.data.length === 0 && <p>Approved restaurants will appear here.</p>}
    {response.data.map(restaurant => <article key={restaurant.id} className="panel stack">
      <h2>{restaurant.name}</h2><p>{restaurant.status} · {restaurant.isOpen ? 'Open' : 'Closed'}</p>
      {session.ok && session.data.selectedRestaurantId === restaurant.id
        ? <div className="member-nav"><Link href="/owner/profile">Edit profile</Link><Link href="/owner/tables">Manage tables</Link></div>
        : <ActionForm label="Select restaurant" run={selectRestaurant.bind(null, restaurant.id)} next="/owner/profile" />}
    </article>)}
  </div>;
}
