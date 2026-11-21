'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result } from '@/shared/auth/permissions';
import { requireCatalogAccess } from '../internal/catalog';

export async function listMenuItems(restaurantId: T.ID): Promise<T.ServiceResult<T.MenuItem[]>> {
  return result(async () => {
    await requireCatalogAccess(restaurantId);
    return (await store.list('menuItems', { restaurantId })).filter(item => !item.archivedAt);
  });
}