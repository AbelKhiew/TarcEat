import 'server-only';
import type * as T from '@/shared/types';

/** Module 4 calls this only after checking payment and order completion. */
export async function closeVisit(db: T.MockDatabase, visitId: T.ID): Promise<T.ServiceResult<T.TableVisit>> {
  const visit = db.visits.find(row => row.id === visitId);
  if (!visit) return { ok: false, error: { code: 'NOT_FOUND', message: 'Table visit not found.' } };
  if (visit.status === 'open') {
    visit.status = 'closed';
    visit.closedAt = new Date().toISOString();
  }
  return { ok: true, data: visit };
}
