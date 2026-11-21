"use server";

import type * as T from "@/shared/types";

/** List restaurant categories.
 * Expected success data: T.Category[]. Undefined means NOT IMPLEMENTED.
 */
export async function listCategories(restaurantId: T.ID): T.StubResult<T.Category[]> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.Category[]>> instead of T.StubResult.
}
