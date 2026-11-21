import Screen from '@/member-1/module-3-tables/screens/TableList';
import MemberNavigation from '@/member-1/screens/MemberNavigation';

export const dynamic = 'force-dynamic';

export default function Page() {
  return <><MemberNavigation /><main className="page"><Screen /></main></>;
}
