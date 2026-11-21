'use client';
import ActionForm from '@/member-1/screens/ActionForm';
import Field from '@/member-1/screens/Field';

import { submitRestaurantApplication } from '../functions/submitRestaurantApplication';
export default function RestaurantApplicationForm() {
  return <section className="panel stack"><h2>New restaurant application</h2>
    <ActionForm label="Submit application" run={data => submitRestaurantApplication({
      restaurantName: String(data.get('name')), address: String(data.get('address')),
      contactPhone: String(data.get('phone')), bio: String(data.get('bio')),
    })}>
      <Field name="name" label="Restaurant name" /><Field name="address" label="Address" />
      <Field name="phone" label="Contact phone" type="tel" /><Field name="bio" label="Description" required={false} />
    </ActionForm>
  </section>;
}
