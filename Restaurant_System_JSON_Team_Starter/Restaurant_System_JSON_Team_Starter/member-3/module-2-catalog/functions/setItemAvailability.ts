'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { getOwnedMenuItem, serializeCatalogChange } from '../internal/catalog';

export async function setItemAvailability(itemId: T.ID, isAvailable: boolean): Promise<T.ServiceResult<T.MenuItem>> {
  return result(() => serializeCatalogChange(async () => {
    const item = await getOwnedMenuItem(itemId);
    if (item.archivedAt) throw new RuleError('Archived items cannot be edited.');
    if (typeof isAvailable !== 'boolean') throw new RuleError('Choose whether the item is available.');
    return store.update('menuItems', itemId, { isAvailable });
  }));
}
