import Link from 'next/link';
import { getSession } from '@/shared/auth/getSession';
import { signOut } from '@/shared/auth/signOut';
import ActionForm from './ActionForm';

export default async function MemberNavigation() {
  const session = await getSession();
  const role = session.ok ? session.data.role : null;
  return <header className="site-header">
    <Link className="brand" href="/restaurants">TABLE &amp; CO</Link>
    <nav className="member-nav" aria-label="Main menu">
      {role === 'owner' && <>
        <Link href="/owner/applications">Applications</Link><Link href="/owner/restaurants">Restaurants</Link>
        <Link href="/owner/profile">Profile</Link><Link href="/owner/tables">Tables</Link>
      </>}
      {role === 'root_admin' && <><Link href="/admin/applications">Review applications</Link><Link href="/admin/restaurants">Restaurant status</Link></>}
      {role ? <ActionForm label="Sign out" run={signOut} next="/login" /> : <Link href="/login">Sign in</Link>}
    </nav>
  </header>;
}
