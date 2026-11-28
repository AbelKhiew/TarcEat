"use server";
import { store } from '@/shared/storage';
import { result } from '@/shared/auth/permissions';
import { getCartAccess, now } from '@/member-2/internal/rules';
import { serializeMemberTwo } from '@/member-2/internal/serialize';
import type * as T from '@/shared/types';
export async function clearCart(cartId: T.ID): Promise<T.ServiceResult<T.Cart>> {
  return result(() => serializeMemberTwo(async () => {
    const cart = await getCartAccess(cartId);
    return store.update('carts', cart.id, { lines: [], updatedAt: now() });
  }));
}
