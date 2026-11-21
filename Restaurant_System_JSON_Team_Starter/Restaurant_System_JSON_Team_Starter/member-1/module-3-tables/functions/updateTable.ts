'use server';
import { store } from '@/shared/storage';
import { serializeChanges } from '@/shared/storage/serializeChanges';
import { ownedRestaurant, result, RuleError } from '@/shared/auth/permissions';
import { integer } from '@/member-1/validation';
import type * as T from '@/shared/types';

export async function updateTable(tableId: T.ID, input: T.TableInput): Promise<T.ServiceResult<T.RestaurantTable>> {
  return result(() => serializeChanges(async () => {
    const table = await store.get('tables', tableId);
    if (!table) throw new RuleError('Table not found.');
    const restaurant = await ownedRestaurant(table.restaurantId);
    if (restaurant.status === 'archived') throw new RuleError('This restaurant is archived.');
    const tableNumber = integer(input?.tableNumber, 'Table number', 1, 999);
    const matches = await store.list('tables', { restaurantId: restaurant.id, tableNumber });
    if (matches.some(match => match.id !== tableId)) throw new RuleError('That table number already exists.');
    return store.update('tables', tableId, { tableNumber });
  }));
}
