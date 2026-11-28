"use server";
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { getOrderOrError, getOrderAccess, requireText } from '@/member-2/internal/rules';
import { serializeMemberTwo } from '@/member-2/internal/serialize';
import type * as T from '@/shared/types';
export async function requestCancellation(input: T.CancellationInput): Promise<T.ServiceResult<T.Order>> {
  return result(() => serializeMemberTwo(async () => {
    const order = await getOrderOrError(input.orderId);
    const access = await getOrderAccess(order, input.guestTrackingToken);
    if (access === 'owner') throw new RuleError('The customer must request cancellation.');
    if (order.status !== 'pending' || order.cancellationStatus === 'requested')
      throw new RuleError('Cancellation can only be requested once while the order is Pending.');
    const reason = requireText(input.reason, 'Reason', 250);
    return store.update('orders', order.id, { cancellationStatus: 'requested', cancellationReason: reason });
  }));
}
