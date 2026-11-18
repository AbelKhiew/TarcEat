"use server";

import type * as T from "@/shared/types";

/** Return approved, active restaurants for search; show operating status.
 * Expected success data: T.Restaurant[]. Undefined means NOT IMPLEMENTED.
 */
export async function listPublicRestaurants(): T.StubResult<T.Restaurant[]> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.Restaurant[]>> instead of T.StubResult.
}
