"use server";

import type * as T from "@/shared/types";

/** Deactivate without deleting transaction history.
 * Expected success data: null. Undefined means NOT IMPLEMENTED.
 */
export async function deactivateMyProfile(): T.StubResult<null> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<null>> instead of T.StubResult.
}
