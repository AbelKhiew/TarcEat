import 'server-only';
import { randomUUID } from 'node:crypto';
import type * as T from '@/shared/types';

function invalid(message: string): T.ServiceResult<never> {
  return { ok: false, error: { code: 'RULE', message } };
}

/** Integration helper. Uses only the coordinator's working snapshot. */
export async function awardCompletionPoints(
  db: T.MockDatabase,
  input: T.CompletionPointsInput,
): Promise<T.ServiceResult<T.LoyaltyTransaction | null>> {
  const order = db.orders.find(entry => entry.id === input.orderId);
  if (!order) return invalid('Order was not found.');
  const { customerId } = order;
  if (!customerId || order.status !== 'completed') return { ok: true, data: null };

  const existing = db.loyaltyTransactions.find(entry =>
    entry.type === 'order_completion' && entry.orderId === order.id);
  if (existing) return { ok: true, data: existing };

  const pointsDelta = Math.floor((order.subtotalSen - order.discountSen) / 100);
  if (pointsDelta <= 0) return { ok: true, data: null };

  const transaction: T.LoyaltyTransaction = {
    id: randomUUID(),
    customerId,
    orderId: order.id,
    customerVoucherId: null,
    type: 'order_completion',
    pointsDelta,
    createdAt: new Date().toISOString(),
  };
  const account = db.loyaltyAccounts.find(entry => entry.customerId === customerId);
  const previousBalance = db.loyaltyTransactions.reduce(
    (balance, entry) => entry.customerId === customerId ? balance + entry.pointsDelta : balance,
    0,
  );
  const pointsBalance = previousBalance + pointsDelta;
  if (account) account.pointsBalance = pointsBalance;
  else db.loyaltyAccounts.push({ id: randomUUID(), customerId, pointsBalance });
  db.loyaltyTransactions.push(transaction);
  return { ok: true, data: transaction };
}
