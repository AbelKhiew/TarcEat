'use server';
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { field } from '@/member-1/validation';
import type * as T from '@/shared/types';

export async function validateTableToken(token: string): Promise<T.ServiceResult<T.TableContext>> {
  return result(async () => {
    const value = field(token, 'Table token', 1, 200);
    const [table] = await store.list('tables', { qrToken: value });
    const restaurant = table && await store.get('restaurants', table.restaurantId);
    if (!table || !restaurant || restaurant.status === 'archived') throw new RuleError('This table QR code is unavailable.');
    const [visit] = await store.list('visits', { tableId: table.id, restaurantId: restaurant.id, status: 'open' });
    return { table, restaurant, visit: visit ?? null };
  });
}
