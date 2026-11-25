import 'server-only';
import type * as T from '@/shared/types';

function invalid(message: string): T.ServiceResult<never> {
  return { ok: false, error: { code: 'RULE', message } };
}

/** Integration helper. Uses only the coordinator's working snapshot. */
export async function reverseVoucherUse(
  db: T.MockDatabase,
  orderId: T.ID,
): Promise<T.ServiceResult<null>> {
  const redemption = db.voucherRedemptions.find(entry => entry.orderId === orderId && !entry.reversedAt);
  if (!redemption) return { ok: true, data: null };

  const now = new Date();
  if (redemption.customerVoucherId !== null) {
    const claim = db.customerVouchers.find(entry => entry.id === redemption.customerVoucherId &&
      entry.customerId === redemption.customerId && entry.voucherId === redemption.voucherId);
    if (!claim || claim.usesCount <= 0) return invalid('The voucher claim could not be restored.');

    claim.usesCount -= 1;
    if (claim.status === 'exhausted' && claim.usesCount < claim.useLimit) {
      const voucher = db.vouchers.find(entry => entry.id === claim.voucherId);
      claim.status = voucher && Date.parse(voucher.expiresAt) > now.getTime() ? 'usable' : 'expired';
    }
  }
  redemption.reversedAt = now.toISOString();
  return { ok: true, data: null };
}
