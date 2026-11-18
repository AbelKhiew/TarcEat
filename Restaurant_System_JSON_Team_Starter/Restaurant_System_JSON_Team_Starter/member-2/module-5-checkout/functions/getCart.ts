"use server";

import type * as T from "@/shared/types";

/** Read current user/browser cart.
 * Expected success data: T.Cart | null. Undefined means NOT IMPLEMENTED.
 */
export async function getCart(cartId: T.ID): T.StubResult<T.Cart | null> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.Cart | null>> instead of T.StubResult.
}
