"use server";
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { getOrderOrError, requireOwnerOfOrder, now } from '@/member-2/internal/rules';
import { serializeMemberTwo } from '@/member-2/internal/serialize';
import type * as T from '@/shared/types';
export async function archiveOrder(orderId: T.ID): Promise<T.ServiceResult<T.Order>> {
  return result(() => serializeMemberTwo(async () => {
    const order = await getOrderOrError(orderId);
    await requireOwnerOfOrder(order);
    if (!['completed', 'cancelled'].includes(order.status)) throw new RuleError('Only completed or cancelled orders can be archived.');
    if (order.archivedAt) return order;
    return store.update('orders', orderId, { archivedAt: now() });
  }));
}
