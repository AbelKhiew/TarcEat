'use server';
import { randomUUID } from 'node:crypto';
import { store } from '@/shared/storage';
import { serializeChanges } from '@/shared/storage/serializeChanges';
import { ownedRestaurant, result, RuleError } from '@/shared/auth/permissions';
import type * as T from '@/shared/types';

export async function regenerateTableToken(tableId: T.ID): Promise<T.ServiceResult<T.RestaurantTable>> {
  return result(() => serializeChanges(async () => {
    const table = await store.get('tables', tableId);
    if (!table) throw new RuleError('Table not found.');
    const restaurant = await ownedRestaurant(table.restaurantId);
    if (restaurant.status === 'archived') throw new RuleError('This restaurant is archived.');
    return store.update('tables', tableId, { qrToken: randomUUID() });
  }));
}
