'use server';
import { store } from '@/shared/storage';
import { serializeChanges } from '@/shared/storage/serializeChanges';
import { requireRole, result, RuleError } from '@/shared/auth/permissions';
import type * as T from '@/shared/types';

export async function setRestaurantStatus(restaurantId: T.ID, status: T.RestaurantStatus): Promise<T.ServiceResult<T.Restaurant>> {
  return result(() => serializeChanges(async () => {
    await requireRole('root_admin');
    const restaurant = await store.get('restaurants', restaurantId);
    if (!restaurant) throw new RuleError('Restaurant not found.');
    if (status !== 'active' && status !== 'suspended' && status !== 'archived') throw new RuleError('Invalid restaurant status.');
    if (restaurant.status === 'archived' && status !== 'archived') throw new RuleError('This restaurant has been archived.');
    return store.update('restaurants', restaurantId, { status, ...(status === 'archived' ? { isOpen: false } : {}) });
  }));
}
