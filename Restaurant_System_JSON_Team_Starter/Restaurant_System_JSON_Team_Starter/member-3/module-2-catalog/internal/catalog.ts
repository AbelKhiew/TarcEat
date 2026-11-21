import 'server-only';
import { ownedRestaurant, RuleError } from '@/shared/auth/permissions';
import { store } from '@/shared/storage';
import type { MenuItemInput } from '@/shared/types';

const state = globalThis as typeof globalThis & { catalogChangeQueue?: Promise<unknown> };

export function serializeCatalogChange<T>(work: () => Promise<T>): Promise<T> {
  const next = (state.catalogChangeQueue ?? Promise.resolve()).then(work);
  state.catalogChangeQueue = next.then(() => undefined, () => undefined);
  return next;
}

export async function requireCatalogAccess(restaurantId: string) {
  const restaurant = await store.get('restaurants', restaurantId);
  if (!restaurant) throw new RuleError('Restaurant was not found.');
  if (restaurant.status === 'active') return;
  await ownedRestaurant(restaurantId);
}

export async function getOwnedMenuItem(itemId: string) {
  const item = await store.get('menuItems', itemId);
  if (!item) throw new RuleError('Menu item was not found.');
  await ownedRestaurant(item.restaurantId);
  return item;
}

export async function validateCategoryName(restaurantId: string, value: unknown, currentId?: string) {
  const name = typeof value === 'string' ? value.trim() : '';
  if (!name || name.length > 80) throw new RuleError('Enter a category name of up to 80 characters.');
  const categories = await store.list('categories', { restaurantId });
  if (categories.some(category => category.id !== currentId && category.name.toLowerCase() === name.toLowerCase())) {
    throw new RuleError('A category with that name already exists.');
  }
  return name;
}

export async function validateMenuItem(restaurantId: string, input: MenuItemInput): Promise<MenuItemInput> {
  if (!input || typeof input.name !== 'string' || !input.name.trim() || input.name.trim().length > 120) {
    throw new RuleError('Enter an item name of up to 120 characters.');
  }
  if (typeof input.description !== 'string' || input.description.length > 1000) {
    throw new RuleError('Enter a description of up to 1,000 characters.');
  }
  if (!Number.isSafeInteger(input.priceSen) || input.priceSen <= 0) {
    throw new RuleError('Enter a positive price with up to two decimal places.');
  }
  if (typeof input.categoryId !== 'string' || typeof input.isAvailable !== 'boolean') {
    throw new RuleError('Choose a category and availability.');
  }
  const category = await store.get('categories', input.categoryId);
  if (!category || category.restaurantId !== restaurantId) throw new RuleError('Choose a category for this restaurant.');
  const imageUrl = input.imageUrl;
  if (imageUrl !== null && (typeof imageUrl !== 'string' || imageUrl.length > 2048 ||
      !/^https:\/\/[^\s]+$/i.test(imageUrl) || !URL.canParse(imageUrl))) {
    throw new RuleError('Enter a valid HTTPS image URL.');
  }
  return { name: input.name.trim(), description: input.description.trim(), categoryId: category.id,
    priceSen: input.priceSen, imageUrl, isAvailable: input.isAvailable };
}