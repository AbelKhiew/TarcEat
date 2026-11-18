"use server";

import type * as T from "@/shared/types";

/** Remove one line.
 * Expected success data: T.Cart. Undefined means NOT IMPLEMENTED.
 */
export async function removeCartItem(cartId: T.ID, lineId: T.ID): T.StubResult<T.Cart> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.Cart>> instead of T.StubResult.
}
