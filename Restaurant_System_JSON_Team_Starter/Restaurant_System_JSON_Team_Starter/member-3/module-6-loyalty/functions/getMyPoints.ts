'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result, requireRole } from '@/shared/auth/permissions';

export async function getMyPoints(): Promise<T.ServiceResult<number>> {
  return result(async () => {
    const customerId = await requireRole('customer');
    const ledger = await store.list('loyaltyTransactions', { customerId });
    return ledger.reduce((balance, entry) => balance + entry.pointsDelta, 0);
  });
}