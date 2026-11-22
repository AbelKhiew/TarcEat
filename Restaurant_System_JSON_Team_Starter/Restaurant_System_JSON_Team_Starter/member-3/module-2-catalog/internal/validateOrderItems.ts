import 'server-only';
import type * as T from '@/shared/types';

function invalid(message: string): T.ServiceResult<never> {
  return { ok: false, error: { code: 'RULE', message } };
}

/** Integration helper. Uses only the coordinator's working snapshot. */
export async function validateOrderItems(
  db: T.MockDatabase,
  restaurantId: T.ID,
  lines: T.CartLine[],
): Promise<T.ServiceResult<T.MenuItem[]>> {
  if (!lines.length) return invalid('The cart is empty.');
  const catalog = new Map(db.menuItems.map(item => [item.id, item]));
  const items: T.MenuItem[] = [];
  for (const line of lines) {
    if (!Number.isSafeInteger(line.quantity) || line.quantity <= 0) {
      return invalid('Enter a positive whole quantity.');
    }
    const item = catalog.get(line.itemId);
    if (!item || item.restaurantId !== restaurantId || !item.isAvailable || item.archivedAt) {
      return invalid('A cart item is no longer available at this restaurant.');
    }
    items.push(item);
  }
  return { ok: true, data: items };
}
