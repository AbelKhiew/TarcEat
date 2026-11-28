"use server";
import { randomUUID } from 'node:crypto';
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { readSession } from '@/shared/auth/devSession';
import { now } from '@/member-2/internal/rules';
import { serializeMemberTwo } from '@/member-2/internal/serialize';
import { awardPointsOnce, issueReceipt } from '@/member-2/internal/completion';
import type * as T from '@/shared/types';
export async function finishTableVisit(visitId: T.ID): Promise<T.ServiceResult<T.Receipt>> {
  return result(() => serializeMemberTwo(async () => {
    const visit = await store.get('visits', visitId);
    if (!visit) throw new RuleError('Table visit not found.');
    const restaurant = await store.get('restaurants', visit.restaurantId);
    const session = await readSession();
    if (!restaurant || session.role !== 'owner' || restaurant.ownerId !== session.profileId)
      throw new RuleError('Only the restaurant owner can finish this table.');
    const existing = (await store.list('receipts', { visitId }))[0];
    if (existing) return existing;
    if (visit.status !== 'open') throw new RuleError('This table visit is already closed.');
    const orders = (await store.list('orders', { visitId })).filter(o => o.status !== 'cancelled');
    if (!orders.length || orders.some(o => o.status !== 'ready' || o.cancellationStatus === 'requested'))
      throw new RuleError('All remaining orders must be Ready and cancellation requests resolved.');
    const amount = orders.reduce((sum, order) => sum + order.totalSen, 0);
    const payment = await store.create('paymentRecords', { id: randomUUID(), orderId: null, visitId,
      method: 'counter', status: 'paid', isSimulated: false, amountSen: amount, paidAt: now(), refundedAt: null });
    const completed: T.Order[] = [];
    for (const order of orders) {
      const updated = await store.update('orders', order.id, { status: 'completed', paymentStatus: 'paid', completedAt: now() });
      completed.push(updated);
      await awardPointsOnce(updated);
    }
    await store.update('visits', visit.id, { status: 'closed', closedAt: now() });
    return issueReceipt({ visitId, orders: completed, paymentId: payment.id });
  }));
}
