"use server";
import { store } from '@/shared/storage';
import { result } from '@/shared/auth/permissions';
import { getOrderOrError, getOrderAccess } from '@/member-2/internal/rules';
import type * as T from '@/shared/types';
export async function getOrder(input: T.TrackingInput): Promise<T.ServiceResult<T.OrderDetails>> {
  return result(async () => {
    const order = await getOrderOrError(input.orderId);
    await getOrderAccess(order, input.guestTrackingToken);
    return { order, items: await store.list('orderItems', { orderId: order.id }) };
  });
}
