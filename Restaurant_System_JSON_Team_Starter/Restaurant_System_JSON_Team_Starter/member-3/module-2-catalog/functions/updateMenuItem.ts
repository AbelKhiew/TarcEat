'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { getOwnedMenuItem, validateMenuItem, serializeCatalogChange } from '../internal/catalog';

export async function updateMenuItem(itemId: T.ID, input: T.MenuItemInput): Promise<T.ServiceResult<T.MenuItem>> {
  return result(() => serializeCatalogChange(async () => {
    const item = await getOwnedMenuItem(itemId);
    if (item.archivedAt) throw new RuleError('Archived items cannot be edited.');
    return store.update('menuItems', itemId, await validateMenuItem(item.restaurantId, input));
  }));
}
