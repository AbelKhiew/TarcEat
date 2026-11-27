"use server";
import { store } from '@/shared/storage';
import { result } from '@/shared/auth/permissions';
import { getCartAccess } from '@/member-2/internal/rules';
import { priceCart } from '@/member-2/internal/pricing';
import type * as T from '@/shared/types';
export async function previewCheckout(input: T.CheckoutInput): Promise<T.ServiceResult<T.CheckoutPreview>> {
  return result(async () => {
    const cart = await getCartAccess(input?.cartId);
    return (await priceCart(cart, input)).totals;
  });
}
