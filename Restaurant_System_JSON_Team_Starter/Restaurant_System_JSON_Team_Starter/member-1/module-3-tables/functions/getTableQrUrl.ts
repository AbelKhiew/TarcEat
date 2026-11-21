'use server';
import { store } from '@/shared/storage';
import { ownedRestaurant, result, RuleError } from '@/shared/auth/permissions';
import type * as T from '@/shared/types';

export async function getTableQrUrl(tableId: T.ID): Promise<T.ServiceResult<string>> {
  return result(async () => {
    const table = await store.get('tables', tableId);
    if (!table) throw new RuleError('Table not found.');
    await ownedRestaurant(table.restaurantId);
    const configured = process.env.RESTAURANT_QR_ORIGIN?.trim();
    const origin = configured ? new URL(configured) : new URL('http://localhost:3000');
    if (!['http:', 'https:'].includes(origin.protocol)) throw new RuleError('QR origin must use HTTP or HTTPS.');
    const url = new URL('/menu', origin.origin);
    url.searchParams.set('table', table.qrToken);
    return url.toString();
  });
}
