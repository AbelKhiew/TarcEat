"use server";
import { store } from '@/shared/storage';
import { result, requireRole } from '@/shared/auth/permissions';
import type * as T from '@/shared/types';
export async function listMyOrders(): Promise<T.ServiceResult<T.Order[]>> {
  return result(async () => (await store.list('orders', { customerId: await requireRole('customer') }))
    .filter(order => !order.archivedAt).sort((a,b) => b.createdAt.localeCompare(a.createdAt)));
}
