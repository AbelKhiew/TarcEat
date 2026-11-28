"use server";
import { store } from '@/shared/storage';
import { result, RuleError } from '@/shared/auth/permissions';
import { getCartAccess, now } from '@/member-2/internal/rules';
import { serializeMemberTwo } from '@/member-2/internal/serialize';
import type * as T from '@/shared/types';
export async function removeCartItem(cartId: T.ID, lineId: T.ID): Promise<T.ServiceResult<T.Cart>> {
  return result(() => serializeMemberTwo(async () => {
    const cart = await getCartAccess(cartId);
    if (!cart.lines.some(line => line.id === lineId)) throw new RuleError('Item was not found in the cart.');
    return store.update('carts', cart.id, { lines: cart.lines.filter(line => line.id !== lineId), updatedAt: now() });
  }));
}
