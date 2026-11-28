import 'server-only';
import { randomUUID } from 'node:crypto';
import { store } from '@/shared/storage';
import type * as T from '@/shared/types';
import { now } from './rules';
/** Points are earned once per completed order; guests never earn points. */
export async function awardPointsOnce(order: T.Order) {
  if (!order.customerId) return;
  const previous = (await store.list('loyaltyTransactions', { orderId: order.id }))
    .some(row => row.type === 'order_completion');
  if (previous) return;
  const points = Math.floor(Math.max(0, order.subtotalSen - order.discountSen) / 100);
  if (!points) return;
  const [account] = await store.list('loyaltyAccounts', { customerId: order.customerId });
  if (!account) return;
  await store.create('loyaltyTransactions', {
    id: randomUUID(), customerId: order.customerId, orderId: order.id, customerVoucherId: null,
    type: 'order_completion', pointsDelta: points, createdAt: now(),
  });
  await store.update('loyaltyAccounts', account.id, { pointsBalance: account.pointsBalance + points });
}
export async function issueReceipt(input: { orderId?: string; visitId?: string; orders: T.Order[]; paymentId: string }) {
  const existing = (await store.list('receipts')).find(row =>
    input.orderId ? row.orderId === input.orderId : row.visitId === input.visitId);
  if (existing) return existing;
  const total = (key: 'subtotalSen'|'discountSen'|'taxSen'|'deliveryFeeSen'|'totalSen') => input.orders.reduce((sum, o) => sum + o[key], 0);
  return store.create('receipts', {
    id: randomUUID(), receiptNumber: 'TE-' + Date.now().toString(36).toUpperCase(),
    orderId: input.orderId ?? null, visitId: input.visitId ?? null, paymentId: input.paymentId,
    orderIds: input.orders.map(o => o.id), subtotalSen: total('subtotalSen'), discountSen: total('discountSen'),
    taxSen: total('taxSen'), deliveryFeeSen: total('deliveryFeeSen'), totalSen: total('totalSen'), issuedAt: now(),
  });
}
