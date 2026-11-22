import 'server-only';
import { randomUUID } from 'node:crypto';
import type * as T from '@/shared/types';

function invalid(message: string): T.ServiceResult<never> {
  return { ok: false, error: { code: 'RULE', message } };
}

/** Integration helper. Uses only the coordinator's working snapshot. */
export async function validateAndRecordVoucherUse(
  db: T.MockDatabase,
  input: T.RecordVoucherUseInput,
): Promise<T.ServiceResult<T.VoucherRedemption>> {
  const order = db.orders.find(entry => entry.id === input.orderId);
  if (!order) return invalid('Order was not found.');
  const { customerId } = order;
  if (!customerId || !db.profiles.some(profile => profile.id === customerId && profile.role === 'customer')) {
    return invalid('Voucher use requires a registered customer.');
  }
  if (order.status === 'cancelled' || (order.voucherId !== null && order.voucherId !== input.voucherId)) {
    return invalid('This voucher cannot be used for the order.');
  }

  const existing = db.voucherRedemptions.find(entry => entry.orderId === order.id && !entry.reversedAt);
  if (existing) {
    if (existing.voucherId === input.voucherId && existing.customerVoucherId === input.customerVoucherId &&
        existing.customerId === customerId) {
      return { ok: true, data: existing };
    }
    return invalid('An order may only use one voucher.');
  }

  const voucher = db.vouchers.find(entry => entry.id === input.voucherId);
  const now = new Date();
  if (!voucher || !voucher.isUsable || voucher.archivedAt || !(Date.parse(voucher.expiresAt) > now.getTime()) ||
      (voucher.restaurantId !== null && voucher.restaurantId !== order.restaurantId)) {
    return invalid('This voucher is unavailable for this restaurant.');
  }
  if (order.subtotalSen < voucher.minimumSpendSen) return invalid('This order does not meet the minimum spend.');

  const claim = db.customerVouchers.find(entry => entry.id === input.customerVoucherId &&
    entry.customerId === customerId && entry.voucherId === voucher.id);
  if ((voucher.restaurantId === null || input.customerVoucherId !== null) &&
      (!claim || claim.status !== 'usable' || claim.usesCount >= claim.useLimit)) {
    return invalid('This voucher claim is unavailable.');
  }

  const uses = db.voucherRedemptions.filter(entry => entry.voucherId === voucher.id && !entry.reversedAt);
  if ((voucher.totalUseLimit !== null && uses.length >= voucher.totalUseLimit) ||
      (voucher.perCustomerUseLimit !== null &&
        uses.filter(entry => entry.customerId === customerId).length >= voucher.perCustomerUseLimit)) {
    return invalid('This voucher has reached its usage limit.');
  }

  const redemption: T.VoucherRedemption = {
    id: randomUUID(),
    voucherId: voucher.id,
    customerVoucherId: claim?.id ?? null,
    customerId,
    orderId: order.id,
    redeemedAt: now.toISOString(),
    reversedAt: null,
  };
  if (claim) {
    claim.usesCount += 1;
    if (claim.usesCount >= claim.useLimit) claim.status = 'exhausted';
  }
  db.voucherRedemptions.push(redemption);
  return { ok: true, data: redemption };
}
