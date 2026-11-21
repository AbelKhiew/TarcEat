'use server';

import type * as T from '@/shared/types';
import { store } from '@/shared/storage';
import { result, ownedRestaurant } from '@/shared/auth/permissions';
import { randomUUID } from 'node:crypto';
import { validateMenuItem, serializeCatalogChange } from '../internal/catalog';

export async function createMenuItem(restaurantId: T.ID, input: T.MenuItemInput): Promise<T.ServiceResult<T.MenuItem>> {
  return result(() => serializeCatalogChange(async () => {
    await ownedRestaurant(restaurantId);
    const item = await validateMenuItem(restaurantId, input);
    return store.create('menuItems', { ...item, id: randomUUID(), restaurantId, archivedAt: null });
  }));
}