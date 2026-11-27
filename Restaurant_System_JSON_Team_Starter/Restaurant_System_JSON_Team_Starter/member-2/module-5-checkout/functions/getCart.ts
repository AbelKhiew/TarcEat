"use server";
import { store } from '@/shared/storage';
import { result } from '@/shared/auth/permissions';
import { getCartAccess } from '@/member-2/internal/rules';
import type * as T from '@/shared/types';
export async function getCart(cartId: T.ID): Promise<T.ServiceResult<T.Cart | null>> {
  return result(async () => {
    if (!cartId) return null;
    return getCartAccess(cartId);
  });
}
