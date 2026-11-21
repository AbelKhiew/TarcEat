'use client';
import ActionForm from '@/member-1/screens/ActionForm';
import Field from '@/member-1/screens/Field';

import { createTableBatch } from '../functions/createTableBatch';
export default function BatchTableForm({ restaurantId }: { restaurantId: string }) {
  return <section className="panel stack"><h2>Add several tables</h2>
    <ActionForm label="Add tables" run={data => createTableBatch(restaurantId, { startNumber: Number(data.get('start')), count: Number(data.get('count')) })}>
      <Field type="number" name="start" label="Starting table number" min={1} max={999} />
      <Field type="number" name="count" label="Number of tables" min={1} max={100} />
    </ActionForm>
  </section>;
}
