'use client';
import ActionForm from '@/member-1/screens/ActionForm';
import Field from '@/member-1/screens/Field';

import { signIn } from '@/shared/auth/signIn';
export default function OwnerLoginForm({ admin = false, returnTo }: { admin?: boolean; returnTo?: string }) {
  return <section className="panel stack">
    <h2>{admin ? 'Root Admin' : 'Restaurant owner'}</h2>
    <ActionForm label="Sign in" next={admin ? '/admin/applications' : returnTo ?? '/owner/restaurants'}
      run={data => signIn({ email: String(data.get('email')), password: String(data.get('password')), accountType: admin ? 'root_admin' : 'owner' })}>
      <Field name="email" label="Email" type="email" /><Field name="password" label="Password" type="password" />
    </ActionForm>
  </section>;
}
