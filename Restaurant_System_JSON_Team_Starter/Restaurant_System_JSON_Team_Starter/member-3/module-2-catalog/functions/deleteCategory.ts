'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result, RuleError, ownedRestaurant } from '@/shared/auth/permissions';
import { serializeCatalogChange } from '../internal/catalog';

export async function deleteCategory(categoryId: T.ID): Promise<T.ServiceResult<null>> {
  return result(() => serializeCatalogChange(async () => {
    const category = await store.get('categories', categoryId);
    if (!category) throw new RuleError('Category was not found.');
    await ownedRestaurant(category.restaurantId);
    const items = await store.list('menuItems', { restaurantId: category.restaurantId, categoryId });
    if (items.some(item => !item.archivedAt)) throw new RuleError('Move or archive the items in this category first.');
    await store.remove('categories', categoryId);
    return null;
  }));
}
