"use server";

import type * as T from "@/shared/types";

/** Return the signed-in customer order history; Module 6 delegates to this function.
 * Expected success data: T.Order[]. Undefined means NOT IMPLEMENTED.
 */
export async function listMyOrders(): T.StubResult<T.Order[]> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.Order[]>> instead of T.StubResult.
}
