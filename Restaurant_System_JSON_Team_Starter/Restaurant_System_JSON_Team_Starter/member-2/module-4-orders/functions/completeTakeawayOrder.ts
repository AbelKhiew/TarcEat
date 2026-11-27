"use server";
import { randomUUID } from 'node:crypto';
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { getOrderOrError, requireOwnerOfOrder, now } from '@/member-2/internal/rules';
import { serializeMemberTwo } from '@/member-2/internal/serialize';
import { awardPointsOnce, issueReceipt } from '@/member-2/internal/completion';
import type * as T from '@/shared/types';
export async function completeTakeawayOrder(orderId: T.ID): Promise<T.ServiceResult<T.Order>> {
  return result(() => serializeMemberTwo(async () => {
    const order = await getOrderOrError(orderId);
    await requireOwnerOfOrder(order);
    if (order.mode === 'dine_in') throw new RuleError('Complete dine-in orders using Finish / Paid for the whole table.');
    if (order.status === 'completed') return order;
    if (order.status !== 'ready' || order.cancellationStatus === 'requested')
      throw new RuleError('The order must be Ready and have no pending cancellation request.');
    const completed = await store.update('orders', order.id, { status: 'completed', completedAt: now() });
    const [payment] = await store.list('paymentRecords', { orderId });
    const usedPayment = payment ?? await store.create('paymentRecords', {
      id: randomUUID(), orderId, visitId: null, method: order.paymentMethod,
      status: 'paid', isSimulated: true, amountSen: order.totalSen, paidAt: now(), refundedAt: null,
    });
    await awardPointsOnce(completed);
    await issueReceipt({ orderId, orders: [completed], paymentId: usedPayment.id });
    return completed;
  }));
}
