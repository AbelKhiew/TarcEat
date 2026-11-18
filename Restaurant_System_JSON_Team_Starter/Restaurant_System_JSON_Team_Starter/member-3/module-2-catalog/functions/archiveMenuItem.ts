"use server";

import type * as T from "@/shared/types";

/** Archive without destroying historical references.
 * Expected success data: T.MenuItem. Undefined means NOT IMPLEMENTED.
 */
export async function archiveMenuItem(itemId: T.ID): T.StubResult<T.MenuItem> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.MenuItem>> instead of T.StubResult.
}
