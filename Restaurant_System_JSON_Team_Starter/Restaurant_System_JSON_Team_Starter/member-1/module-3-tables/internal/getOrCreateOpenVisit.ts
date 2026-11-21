import 'server-only';
import { randomUUID } from 'node:crypto';
import type * as T from '@/shared/types';

/** Called during successful order submission on Module 4's working snapshot. */
export async function getOrCreateOpenVisit(db: T.MockDatabase, tableId: T.ID): Promise<T.ServiceResult<T.TableVisit>> {
  const table = db.tables.find(row => row.id === tableId);
  if (!table) return { ok: false, error: { code: 'NOT_FOUND', message: 'Table not found.' } };
  const current = db.visits.find(visit => visit.tableId === tableId && visit.restaurantId === table.restaurantId && visit.status === 'open');
  if (current) return { ok: true, data: current };
  const visit: T.TableVisit = {
    id: randomUUID(), tableId, restaurantId: table.restaurantId, status: 'open',
    openedAt: new Date().toISOString(), closedAt: null,
  };
  db.visits.push(visit);
  return { ok: true, data: visit };
}
