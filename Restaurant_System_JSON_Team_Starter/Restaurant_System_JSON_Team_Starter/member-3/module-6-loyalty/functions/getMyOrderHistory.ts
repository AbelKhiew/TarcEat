"use server";

import type * as T from "@/shared/types";

/** Read Module 4 records; do not duplicate order storage.
 * Expected success data: T.Order[]. Undefined means NOT IMPLEMENTED.
 */
export async function getMyOrderHistory(): T.StubResult<T.Order[]> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.Order[]>> instead of T.StubResult.
}
