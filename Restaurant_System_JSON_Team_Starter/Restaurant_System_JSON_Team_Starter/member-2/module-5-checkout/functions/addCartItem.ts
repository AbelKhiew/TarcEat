"use server";

import type * as T from "@/shared/types";

/** Use catalog item ID, not client price.
 * Expected success data: T.Cart. Undefined means NOT IMPLEMENTED.
 */
export async function addCartItem(cartId: T.ID, input: T.AddCartLineInput): T.StubResult<T.Cart> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.Cart>> instead of T.StubResult.
}
