"use server";
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { readSession } from '@/shared/auth/devSession';
import type * as T from '@/shared/types';
export async function getReceipt(receiptId: T.ID): Promise<T.ServiceResult<T.Receipt>> {
  return result(async () => {
    const receipt = await store.get('receipts', receiptId);
    if (!receipt) throw new RuleError('Receipt not found.');
    const order = await store.get('orders', receipt.orderIds[0]);
    const restaurant = order && await store.get('restaurants', order.restaurantId);
    const session = await readSession();
    if (!order || !restaurant || !(session.role === 'owner' && restaurant.ownerId === session.profileId ||
      session.role === 'customer' && order.customerId === session.profileId))
      throw new RuleError('Sign in as the customer or restaurant owner to view this receipt.');
    return receipt;
  });
}
