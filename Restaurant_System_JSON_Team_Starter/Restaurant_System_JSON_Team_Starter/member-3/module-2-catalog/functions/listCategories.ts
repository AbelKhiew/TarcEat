'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result } from '@/shared/auth/permissions';
import { requireCatalogAccess } from '../internal/catalog';

export async function listCategories(restaurantId: T.ID): Promise<T.ServiceResult<T.Category[]>> {
  return result(async () => {
    await requireCatalogAccess(restaurantId);
    return (await store.list('categories', { restaurantId })).sort((a, b) => a.name.localeCompare(b.name));
  });
}
