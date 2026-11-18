'use client';
import ActionForm from '@/member-1/screens/ActionForm';
import Field from '@/member-1/screens/Field';

import { createTable } from '../functions/createTable';
export default function IndividualTableForm({ restaurantId }: { restaurantId: string }) {
  return <section className="panel stack"><h2>Add a table</h2>
    <ActionForm label="Add table" run={data => createTable(restaurantId, { tableNumber: Number(data.get('number')) })}>
      <Field type="number" name="number" label="Table number" min={1} max={999} />
    </ActionForm>
  </section>;
}
