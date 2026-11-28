"use server";
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { getCartAccess, requireQuantity, validateNote, now } from '@/member-2/internal/rules';
import { serializeMemberTwo } from '@/member-2/internal/serialize';
import type * as T from '@/shared/types';
export async function updateCartItem(cartId: T.ID, lineId: T.ID, input: T.UpdateCartLineInput): Promise<T.ServiceResult<T.Cart>> {
  return result(() => serializeMemberTwo(async () => {
    const cart = await getCartAccess(cartId);
    const quantity = requireQuantity(input?.quantity);
    const note = validateNote(input?.note);
    if (!cart.lines.some(line => line.id === lineId)) throw new RuleError('Cart item was not found.');
    const lines = cart.lines.map(line => line.id === lineId ? { ...line, quantity, note } : line);
    return store.update('carts', cart.id, { lines, updatedAt: now() });
  }));
}
