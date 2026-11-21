'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result } from '@/shared/auth/permissions';
import { getOwnedMenuItem, serializeCatalogChange } from '../internal/catalog';

export async function archiveMenuItem(itemId: T.ID): Promise<T.ServiceResult<T.MenuItem>> {
  return result(() => serializeCatalogChange(async () => {
    const item = await getOwnedMenuItem(itemId);
    if (item.archivedAt) return item;
    return store.update('menuItems', itemId, { archivedAt: new Date().toISOString(), isAvailable: false });
  }));
}
