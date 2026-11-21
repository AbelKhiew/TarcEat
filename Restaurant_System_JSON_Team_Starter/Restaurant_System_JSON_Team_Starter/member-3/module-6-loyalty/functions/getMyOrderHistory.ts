'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result, requireRole } from '@/shared/auth/permissions';

export async function getMyOrderHistory(): Promise<T.ServiceResult<T.Order[]>> {
  return result(async () => {
    const customerId = await requireRole('customer');
    return (await store.list('orders', { customerId })).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  });
}
