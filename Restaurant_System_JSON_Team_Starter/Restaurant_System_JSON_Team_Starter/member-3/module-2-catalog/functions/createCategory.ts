'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result, ownedRestaurant } from '@/shared/auth/permissions';
import { randomUUID } from 'node:crypto';
import { validateCategoryName, serializeCatalogChange } from '../internal/catalog';

export async function createCategory(restaurantId: T.ID, input: T.CategoryInput): Promise<T.ServiceResult<T.Category>> {
  return result(() => serializeCatalogChange(async () => {
    await ownedRestaurant(restaurantId);
    const name = await validateCategoryName(restaurantId, input?.name);
    return store.create('categories', { id: randomUUID(), restaurantId, name });
  }));
}