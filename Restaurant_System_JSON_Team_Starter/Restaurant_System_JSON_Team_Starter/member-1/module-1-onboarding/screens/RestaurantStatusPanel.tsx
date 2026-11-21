import ActionForm from '@/member-1/screens/ActionForm';
import { listAllRestaurants } from '../functions/listAllRestaurants';
import { setRestaurantStatus } from '../functions/setRestaurantStatus';
import { archiveRestaurant } from '../functions/archiveRestaurant';

export default async function RestaurantStatusPanel() {
  const response = await listAllRestaurants();
  if (!response.ok) return <p className="notice notice-error">{response.error.message}</p>;
  return <div className="stack"><h1>Restaurant status</h1>
    {response.data.map(restaurant => <article key={restaurant.id} className="panel stack">
      <h2>{restaurant.name}</h2><p>Status: {restaurant.status}</p>
      {restaurant.status !== 'archived' && <>
        <ActionForm label={restaurant.status === 'active' ? 'Suspend' : 'Reactivate'} run={setRestaurantStatus.bind(null, restaurant.id, restaurant.status === 'active' ? 'suspended' : 'active')} />
        <ActionForm label="Archive restaurant" run={async data => {
          'use server';
          if (data.get('confirm') !== 'on') return { ok: false, error: { code: 'CONFIRM', message: 'Confirm archival first.' } };
          return archiveRestaurant(restaurant.id);
        }}><label><input type="checkbox" name="confirm" required /> Confirm archive</label></ActionForm>
      </>}
    </article>)}
  </div>;
}
