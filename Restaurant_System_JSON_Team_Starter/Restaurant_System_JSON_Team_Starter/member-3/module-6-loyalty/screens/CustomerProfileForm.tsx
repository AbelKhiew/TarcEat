import { connection } from 'next/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getMyProfile } from '../functions/getMyProfile';
import { updateMyProfile } from '../functions/updateMyProfile';
import { deactivateMyProfile } from '../functions/deactivateMyProfile';
import CustomerProfileEditor from './CustomerProfileEditor';
import CustomerSignIn from './CustomerSignIn';

export default async function CustomerProfileForm() {
  await connection();
  const profile = await getMyProfile();
  if (!profile.ok) return profile.error.code === "RULE" ? <CustomerSignIn /> : <p role="alert" className="notice notice-error">{profile.error.message}</p>;

  async function save(data: FormData) {
    'use server';
    return updateMyProfile({ fullName: String(data.get('name') ?? ''), phone: String(data.get('phone') ?? ''),
      address: String(data.get('address') ?? '') || null });
  }
  async function deactivate() {
    'use server';
    const response = await deactivateMyProfile();
    if (response.ok) redirect('/account');
    return response.error.message;
  }

  return <section className="panel stack">
    <h1>My account</h1>
    <nav aria-label="Customer account"><Link href="/account/points">Points</Link>{' Â· '}
      <Link href="/account/vouchers">Vouchers</Link>{' Â· '}<Link href="/account/orders">Orders</Link></nav>
    <CustomerProfileEditor profile={profile.data} save={save} deactivate={deactivate} />
  </section>;
}
