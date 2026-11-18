import type * as T from "@/shared/types";

/** Strict completed-module contract. Scaffold implementations are intentionally not assigned here yet. */
export interface CheckoutService {
  /** Read current user/browser cart. */
  getCart(cartId: T.ID): Promise<T.ServiceResult<T.Cart | null>>;
  /** One restaurant, mode and table context per cart. */
  createCart(input: T.CartInput): Promise<T.ServiceResult<T.Cart>>;
  /** Use catalog item ID, not client price. */
  addCartItem(cartId: T.ID, input: T.AddCartLineInput): Promise<T.ServiceResult<T.Cart>>;
  /** Positive integer quantity; validate notes. */
  updateCartItem(cartId: T.ID, lineId: T.ID, input: T.UpdateCartLineInput): Promise<T.ServiceResult<T.Cart>>;
  /** Remove one line. */
  removeCartItem(cartId: T.ID, lineId: T.ID): Promise<T.ServiceResult<T.Cart>>;
  /** Clear items when changing restaurant or table context. */
  clearCart(cartId: T.ID): Promise<T.ServiceResult<T.Cart>>;
  /** Preview only. Module 4 revalidates and creates final order. At most one voucher. */
  previewCheckout(input: T.CheckoutInput): Promise<T.ServiceResult<T.CheckoutPreview>>;
}
