import ActionForm from '@/member-1/screens/ActionForm';
import Field from '@/member-1/screens/Field';

import Link from 'next/link';
import { getSession } from '@/shared/auth/getSession';
import { listMyRestaurants } from '../functions/listMyRestaurants';
import { updateRestaurant } from '../functions/updateRestaurant';

export default async function RestaurantProfileForm() {
  const [response, session] = await Promise.all([listMyRestaurants(), getSession()]);
  if (!response.ok) return <p className="notice notice-error">{response.error.message}</p>;
  const restaurant = response.data.find(row => session.ok && row.id === session.data.selectedRestaurantId);
  if (!restaurant) return <Link href="/owner/restaurants">Select a restaurant first</Link>;
  const id = restaurant.id;
  return <section className="panel stack"><h1>{restaurant.name}</h1><p>Platform status: {restaurant.status}</p>
    {restaurant.status !== 'archived' && <ActionForm key={id} label="Save profile" run={async data => {
      'use server';
      return updateRestaurant(id, {
        name: String(data.get('name')), address: String(data.get('address')), phone: String(data.get('phone')),
        bio: String(data.get('bio')), isOpen: data.get('open') === 'on',
        taxRateBps: Number(data.get('tax')), deliveryFeeSen: Number(data.get('fee')),
      });
    }}>
      <Field name="name" label="Name" value={restaurant.name} /><Field name="address" label="Address" value={restaurant.address} />
      <Field name="phone" label="Phone" value={restaurant.phone} /><Field name="bio" label="Description" value={restaurant.bio} required={false} />
      <Field name="tax" label="Tax in basis points (600 = 6%)" type="number" min={0} max={10000} value={restaurant.taxRateBps} />
      <Field name="fee" label="Delivery fee in sen" type="number" min={0} max={100000} value={restaurant.deliveryFeeSen} />
      <label><input type="checkbox" name="open" defaultChecked={restaurant.isOpen} /> Open for new orders when active</label>
    </ActionForm>}
    <Link href="/owner/tables">Manage tables</Link>
  </section>;
}
