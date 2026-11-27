"use server";
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { getOrderOrError, requireOwnerOfOrder } from '@/member-2/internal/rules';
import { serializeMemberTwo } from '@/member-2/internal/serialize';
import type * as T from '@/shared/types';
export async function updateOrderStatus(orderId: T.ID, status: T.OrderStatus): Promise<T.ServiceResult<T.Order>> {
  return result(() => serializeMemberTwo(async () => {
    const order = await getOrderOrError(orderId);
    await requireOwnerOfOrder(order);
    if (order.cancellationStatus === 'requested') throw new RuleError('Review the cancellation request before preparing this order.');
    if ((order.status === 'pending' && status === 'preparing') || (order.status === 'preparing' && status === 'ready'))
      return store.update('orders', order.id, { status });
    throw new RuleError('Only Pending → Preparing → Ready is allowed here.');
  }));
}
