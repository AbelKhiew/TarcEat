"use server";
import { store } from '@/shared/storage';
import { result, ownedRestaurant } from '@/shared/auth/permissions';
import type * as T from '@/shared/types';
export async function listRestaurantOrders(restaurantId: T.ID): Promise<T.ServiceResult<T.Order[]>> {
  return result(async () => {
    await ownedRestaurant(restaurantId);
    return (await store.list('orders', { restaurantId })).filter(o => !o.archivedAt)
      .sort((a,b) => b.createdAt.localeCompare(a.createdAt));
  });
}
