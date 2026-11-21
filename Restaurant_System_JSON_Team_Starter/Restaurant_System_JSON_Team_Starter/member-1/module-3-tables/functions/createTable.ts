'use server';
import { randomUUID } from 'node:crypto';
import { store } from '@/shared/storage';
import { serializeChanges } from '@/shared/storage/serializeChanges';
import { ownedRestaurant, result, RuleError } from '@/shared/auth/permissions';
import { integer } from '@/member-1/validation';
import type * as T from '@/shared/types';

export async function createTable(restaurantId: T.ID, input: T.TableInput): Promise<T.ServiceResult<T.RestaurantTable>> {
  return result(() => serializeChanges(async () => {
    const restaurant = await ownedRestaurant(restaurantId);
    if (restaurant.status === 'archived') throw new RuleError('This restaurant is archived.');
    const tableNumber = integer(input?.tableNumber, 'Table number', 1, 999);
    if ((await store.list('tables', { restaurantId, tableNumber })).length) throw new RuleError('That table number already exists.');
    return store.create('tables', { id: randomUUID(), restaurantId, tableNumber, qrToken: randomUUID() });
  }));
}
