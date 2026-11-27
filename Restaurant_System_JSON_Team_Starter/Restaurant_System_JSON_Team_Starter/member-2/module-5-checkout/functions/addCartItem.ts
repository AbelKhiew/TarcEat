"use server";
import { randomUUID } from 'node:crypto';
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { getCartAccess, eligibleRestaurant, requireQuantity, validateNote, now } from '@/member-2/internal/rules';
import { serializeMemberTwo } from '@/member-2/internal/serialize';
import type * as T from '@/shared/types';
export async function addCartItem(cartId: T.ID, input: T.AddCartLineInput): Promise<T.ServiceResult<T.Cart>> {
  return result(() => serializeMemberTwo(async () => {
    const cart = await getCartAccess(cartId);
    await eligibleRestaurant(cart.restaurantId);
    const item = await store.get('menuItems', input?.itemId);
    if (!item || item.restaurantId !== cart.restaurantId || item.archivedAt || !item.isAvailable)
      throw new RuleError('This menu item is unavailable at the selected restaurant.');
    const quantity = requireQuantity(input.quantity);
    const note = validateNote(input.note);
    const lines = [...cart.lines];
    const previous = lines.find(l => l.itemId === item.id && l.note === note);
    if (previous) previous.quantity = requireQuantity(previous.quantity + quantity);
    else lines.push({ id: randomUUID(), itemId: item.id, quantity, note });
    return store.update('carts', cart.id, { lines, updatedAt: now() });
  }));
}
