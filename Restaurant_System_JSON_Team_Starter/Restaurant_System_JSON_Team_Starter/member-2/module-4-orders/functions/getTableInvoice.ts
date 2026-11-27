"use server";
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { readSession } from '@/shared/auth/devSession';
import type * as T from '@/shared/types';
export async function getTableInvoice(tableToken: string): Promise<T.ServiceResult<T.TableInvoice>> {
  return result(async () => {
    const [table] = await store.list('tables', { qrToken: tableToken });
    if (!table) throw new RuleError('Table QR code not found.');
    const restaurant = await store.get('restaurants', table.restaurantId);
    const session = await readSession();
    if (restaurant?.status === 'archived' || (session.role === 'owner' && restaurant?.ownerId !== session.profileId))
      throw new RuleError('Cannot access this table invoice.');
    const [visit] = await store.list('visits', { tableId: table.id, status: 'open' });
    if (!visit) throw new RuleError('There is no current bill for this table.');
    const orders = (await store.list('orders', { visitId: visit.id })).filter(o => o.status !== 'cancelled');
    const items = (await store.list('orderItems')).filter(row => orders.some(order => order.id === row.orderId));
    const sum = (field: 'subtotalSen'|'discountSen'|'taxSen'|'deliveryFeeSen'|'totalSen') => orders.reduce((n, o) => n + o[field], 0);
    return { visit, orders, items, subtotalSen: sum('subtotalSen'), discountSen: sum('discountSen'),
      taxSen: sum('taxSen'), deliveryFeeSen: sum('deliveryFeeSen'), totalSen: sum('totalSen') };
  });
}
