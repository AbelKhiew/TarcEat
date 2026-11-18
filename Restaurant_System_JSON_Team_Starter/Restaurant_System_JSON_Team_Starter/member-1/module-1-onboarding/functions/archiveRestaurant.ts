'use server';
import { store } from '@/shared/storage';
import { serializeChanges } from '@/shared/storage/serializeChanges';
import { requireRole, result, RuleError } from '@/shared/auth/permissions';
import type * as T from '@/shared/types';

export async function archiveRestaurant(restaurantId: T.ID): Promise<T.ServiceResult<T.Restaurant>> {
  return result(() => serializeChanges(async () => {
    await requireRole('root_admin');
    if (!await store.get('restaurants', restaurantId)) throw new RuleError('Restaurant not found.');
    return store.update('restaurants', restaurantId, { status: 'archived', isOpen: false });
  }));
}
