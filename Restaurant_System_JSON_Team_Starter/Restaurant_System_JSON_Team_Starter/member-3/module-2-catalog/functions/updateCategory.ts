'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result, RuleError, ownedRestaurant } from '@/shared/auth/permissions';
import { validateCategoryName, serializeCatalogChange } from '../internal/catalog';

export async function updateCategory(categoryId: T.ID, input: T.CategoryInput): Promise<T.ServiceResult<T.Category>> {
  return result(() => serializeCatalogChange(async () => {
    const category = await store.get('categories', categoryId);
    if (!category) throw new RuleError('Category was not found.');
    await ownedRestaurant(category.restaurantId);
    const name = await validateCategoryName(category.restaurantId, input?.name, categoryId);
    return store.update('categories', categoryId, { name });
  }));
}