'use client';
import ActionForm from '@/member-1/screens/ActionForm';
import Field from '@/member-1/screens/Field';

import { registerOwner } from '../functions/registerOwner';
export default function OwnerRegistrationForm() {
  return <section className="panel stack"><h1>Create an owner account</h1>
    <p>You can sign in after registration and submit a separate restaurant application.</p>
    <ActionForm label="Create account" next="/login" run={data => registerOwner({
      fullName: String(data.get('name')), email: String(data.get('email')),
      phone: String(data.get('phone')), password: String(data.get('password')),
    })}>
      <Field name="name" label="Full name" /><Field name="email" label="Email" type="email" />
      <Field name="phone" label="Phone" type="tel" /><Field name="password" label="Password (8–128 characters)" type="password" />
    </ActionForm>
  </section>;
}
