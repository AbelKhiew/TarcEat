'use server';
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import type * as T from '@/shared/types';

export async function getRestaurantContext(restaurantId: T.ID): Promise<T.ServiceResult<T.RestaurantContext>> {
  return result(async () => {
    const restaurant = await store.get('restaurants', restaurantId);
    if (!restaurant || restaurant.status !== 'active') throw new RuleError('Restaurant unavailable.');
    return { restaurant, canAcceptNewOrders: restaurant.isOpen };
  });
}
