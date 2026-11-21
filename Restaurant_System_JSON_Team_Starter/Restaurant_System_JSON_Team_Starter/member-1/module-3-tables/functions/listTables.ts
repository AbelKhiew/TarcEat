'use server';
import { store } from '@/shared/storage';
import { ownedRestaurant, result } from '@/shared/auth/permissions';
import type * as T from '@/shared/types';

export async function listTables(restaurantId: T.ID): Promise<T.ServiceResult<T.RestaurantTable[]>> {
  return result(async () => {
    await ownedRestaurant(restaurantId);
    return (await store.list('tables', { restaurantId })).sort((a, b) => a.tableNumber - b.tableNumber);
  });
}
