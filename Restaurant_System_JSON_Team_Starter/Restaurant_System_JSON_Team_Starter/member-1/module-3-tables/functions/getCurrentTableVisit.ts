'use server';
import { store } from '@/shared/storage';
import { ownedRestaurant, result, RuleError } from '@/shared/auth/permissions';
import type * as T from '@/shared/types';

export async function getCurrentTableVisit(tableId: T.ID): Promise<T.ServiceResult<T.TableVisit | null>> {
  return result(async () => {
    const table = await store.get('tables', tableId);
    if (!table) throw new RuleError('Table not found.');
    await ownedRestaurant(table.restaurantId);
    const [visit] = await store.list('visits', { tableId, restaurantId: table.restaurantId, status: 'open' });
    return visit ?? null;
  });
}
