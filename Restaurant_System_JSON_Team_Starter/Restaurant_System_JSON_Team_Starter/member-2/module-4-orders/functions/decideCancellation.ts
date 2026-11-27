"use server";
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { getOrderOrError, requireOwnerOfOrder, now } from '@/member-2/internal/rules';
import { serializeMemberTwo } from '@/member-2/internal/serialize';
import type * as T from '@/shared/types';
export async function decideCancellation(orderId: T.ID, approved: boolean): Promise<T.ServiceResult<T.Order>> {
  return result(() => serializeMemberTwo(async () => {
    const order = await getOrderOrError(orderId);
    await requireOwnerOfOrder(order);
    if (order.status !== 'pending' || order.cancellationStatus !== 'requested')
      throw new RuleError('This cancellation request cannot be reviewed.');
    if (approved) {
      for (const redemption of await store.list('voucherRedemptions', { orderId })) {
        if (!redemption.reversedAt) {
          await store.update('voucherRedemptions', redemption.id, { reversedAt: now() });
          if (redemption.customerVoucherId) {
            const claim = await store.get('customerVouchers', redemption.customerVoucherId);
            if (claim) await store.update('customerVouchers', claim.id, { usesCount: Math.max(0, claim.usesCount - 1), status: 'usable' });
          }
        }
      }
      const [payment] = await store.list('paymentRecords', { orderId });
      if (payment?.isSimulated && payment.status === 'paid')
        await store.update('paymentRecords', payment.id, { status: 'refunded', refundedAt: now() });
    }
    return store.update('orders', order.id, {
      status: approved ? 'cancelled' : 'pending', cancellationStatus: approved ? 'approved' : 'rejected',
      paymentStatus: approved && order.paymentStatus === 'paid' ? 'refunded' : order.paymentStatus,
    });
  }));
}
