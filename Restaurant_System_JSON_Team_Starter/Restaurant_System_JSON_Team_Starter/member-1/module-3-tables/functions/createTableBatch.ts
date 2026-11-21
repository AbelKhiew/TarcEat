'use server';
import { randomUUID } from 'node:crypto';
import { store } from '@/shared/storage';
import { serializeChanges } from '@/shared/storage/serializeChanges';
import { ownedRestaurant, result, RuleError } from '@/shared/auth/permissions';
import { integer } from '@/member-1/validation';
import type * as T from '@/shared/types';

export async function createTableBatch(restaurantId: T.ID, input: T.TableBatchInput): Promise<T.ServiceResult<T.RestaurantTable[]>> {
  return result(() => serializeChanges(async () => {
    const restaurant = await ownedRestaurant(restaurantId);
    if (restaurant.status === 'archived') throw new RuleError('This restaurant is archived.');
    const start = integer(input?.startNumber, 'Starting number', 1, 999);
    const count = integer(input.count, 'Table count', 1, 100);
    if (start + count - 1 > 999) throw new RuleError('Table numbers cannot exceed 999.');
    const numbers = new Set((await store.list('tables', { restaurantId })).map(table => table.tableNumber));
    const tables = Array.from({ length: count }, (_, i) => ({
      id: randomUUID(), restaurantId, tableNumber: start + i, qrToken: randomUUID(),
    }));
    if (tables.some(table => numbers.has(table.tableNumber))) throw new RuleError('A table number already exists in this range.');
    return store.createMany('tables', tables);
  }));
}
