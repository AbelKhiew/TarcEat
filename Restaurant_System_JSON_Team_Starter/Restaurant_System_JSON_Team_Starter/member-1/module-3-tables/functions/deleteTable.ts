'use server';
import { store } from '@/shared/storage';
import { serializeChanges } from '@/shared/storage/serializeChanges';
import { ownedRestaurant, result, RuleError } from '@/shared/auth/permissions';
import type * as T from '@/shared/types';

export async function deleteTable(tableId: T.ID): Promise<T.ServiceResult<null>> {
  return result(() => serializeChanges(async () => {
    const table = await store.get('tables', tableId);
    if (!table) throw new RuleError('Table not found.');
    const restaurant = await ownedRestaurant(table.restaurantId);
    if (restaurant.status === 'archived') throw new RuleError('This restaurant is archived.');
    const [visits, carts] = await Promise.all([
      store.list('visits', { tableId }), store.list('carts', { tableToken: table.qrToken }),
    ]);
    if (visits.length || carts.length) throw new RuleError('Only unused tables can be deleted. This table has visits or a cart.');
    await store.remove('tables', tableId);
    return null;
  }));
}
