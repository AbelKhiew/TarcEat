import Link from 'next/link';
import OwnerLoginForm from '@/member-1/module-1-onboarding/screens/OwnerLoginForm';
import MemberNavigation from '@/member-1/screens/MemberNavigation';
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return <><MemberNavigation /><main className="page stack"><h1>Sign in</h1>
    <div className="grid"><OwnerLoginForm /><OwnerLoginForm admin /></div>
    <Link href="/register/owner">Create an owner account</Link>
    {process.env.NODE_ENV === 'development' && <aside className="notice">
      Demo password: Demo12345<br />Owner: sarah.owner@example.test<br />Root Admin: admin@example.test
    </aside>}
  </main></>;
}
