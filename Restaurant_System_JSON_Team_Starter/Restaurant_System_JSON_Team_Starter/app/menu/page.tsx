import Screen from '@/member-3/module-2-catalog/screens/CustomerMenu';
import QrEntryPrompt from '@/member-1/module-3-tables/screens/QrEntryPrompt';
import MemberNavigation from '@/member-1/screens/MemberNavigation';

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: Promise<{ table?: string; guest?: string; restaurant?: string }> }) {
  const { table, guest, restaurant } = await searchParams;
  return <><MemberNavigation /><main className="page">
    {typeof table === 'string' ? <QrEntryPrompt token={table} guest={guest === '1'} />
      : <><Screen />{restaurant && <p>The customer menu will become available when Module 2 is connected.</p>}</>}
  </main></>;
}
