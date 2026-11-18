import ActionForm from '@/member-1/screens/ActionForm';
import Field from '@/member-1/screens/Field';

import Link from 'next/link';
import IndividualTableForm from './IndividualTableForm';
import BatchTableForm from './BatchTableForm';
import TableQrCard from './TableQrCard';
import { getSession } from '@/shared/auth/getSession';
import { listMyRestaurants } from '@/member-1/module-1-onboarding/functions/listMyRestaurants';
import { listTables } from '../functions/listTables';
import { getCurrentTableVisit } from '../functions/getCurrentTableVisit';
import { getTableQrUrl } from '../functions/getTableQrUrl';
import { updateTable } from '../functions/updateTable';
import { regenerateTableToken } from '../functions/regenerateTableToken';
import { deleteTable } from '../functions/deleteTable';

export default async function TableList() {
  const [session, restaurants] = await Promise.all([getSession(), listMyRestaurants()]);
  if (!restaurants.ok) return <p className="notice notice-error">{restaurants.error.message}</p>;
  const restaurant = restaurants.data.find(row => session.ok && row.id === session.data.selectedRestaurantId);
  if (!restaurant) return <Link href="/owner/restaurants">Select a restaurant first</Link>;
  const response = await listTables(restaurant.id);
  if (!response.ok) return <p className="notice notice-error">{response.error.message}</p>;
  const rows = await Promise.all(response.data.map(async table => ({
    table, visit: await getCurrentTableVisit(table.id), url: await getTableQrUrl(table.id),
  })));
  const editable = restaurant.status !== 'archived';
  return <div className="stack"><h1>Tables at {restaurant.name}</h1>
    {editable && <div className="grid"><IndividualTableForm restaurantId={restaurant.id} /><BatchTableForm restaurantId={restaurant.id} /></div>}
    {rows.length === 0 && <p>No tables yet.</p>}
    <div className="grid">{rows.map(({ table, visit, url }) => <article className="panel stack" key={table.id}>
      <h2>Table {table.tableNumber}</h2>
      <p>{visit.ok ? visit.data ? 'Occupied' : 'Available' : 'Visit status unavailable'}</p>
      {url.ok ? <TableQrCard number={table.tableNumber} url={url.data} /> : <p>{url.error.message}</p>}
      {editable && <>
        <ActionForm label="Save table number" run={async data => {
          'use server';
          return updateTable(table.id, { tableNumber: Number(data.get('number')) });
        }}><Field type="number" name="number" label="Table number" min={1} max={999} value={table.tableNumber} /></ActionForm>
        <ActionForm label="Replace QR code" run={regenerateTableToken.bind(null, table.id)} />
        {visit.ok && !visit.data && <ActionForm label="Delete unused table" run={deleteTable.bind(null, table.id)} />}
      </>}
    </article>)}</div>
  </div>;
}
