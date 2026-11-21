'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result, requireRole, RuleError } from '@/shared/auth/permissions';

export async function previewVoucher(input: T.VoucherPreviewInput): Promise<T.ServiceResult<T.VoucherPreview>> {
  return result(async () => {
    const customerId = await requireRole('customer');
    if (!input || !Number.isSafeInteger(input.subtotalSen) || input.subtotalSen < 0 ||
        typeof input.restaurantId !== 'string' ||
        (input.voucherCode !== null && typeof input.voucherCode !== 'string') ||
        (input.customerVoucherId !== null && typeof input.customerVoucherId !== 'string')) {
      throw new RuleError('Enter a valid voucher and subtotal.');
    }
    const code = input.voucherCode?.trim().toUpperCase();
    if (Boolean(code) === Boolean(input.customerVoucherId)) throw new RuleError('Choose one voucher.');
    const claim = input.customerVoucherId ? await store.get('customerVouchers', input.customerVoucherId) : null;
    if (input.customerVoucherId && (!claim || claim.customerId !== customerId || claim.status !== 'usable')) {
      throw new RuleError('This voucher claim is unavailable.');
    }
    const voucher = claim ? await store.get('vouchers', claim.voucherId) :
      (await store.list('vouchers', { restaurantId: input.restaurantId, code }))[0];
    if (!voucher || !voucher.isUsable || voucher.archivedAt || !(Date.parse(voucher.expiresAt) > Date.now()) ||
        (voucher.restaurantId !== null && voucher.restaurantId !== input.restaurantId)) {
      throw new RuleError('This voucher is unavailable for this restaurant.');
    }
    if (input.subtotalSen < voucher.minimumSpendSen) throw new RuleError('This order does not meet the minimum spend.');
    const uses = (await store.list('voucherRedemptions', { voucherId: voucher.id })).filter(use => !use.reversedAt);
    const limits = [
      voucher.totalUseLimit === null ? Infinity : voucher.totalUseLimit - uses.length,
      voucher.perCustomerUseLimit === null ? Infinity : voucher.perCustomerUseLimit - uses.filter(use => use.customerId === customerId).length,
      claim ? claim.useLimit - claim.usesCount : Infinity,
    ];
    const remaining = Math.min(...limits);
    if (remaining <= 0) throw new RuleError('This voucher has reached its usage limit.');
    return { voucherId: voucher.id, discountSen: Math.min(voucher.discountSen, input.subtotalSen),
      remainingUses: Number.isFinite(remaining) ? remaining : null };
  });
}
