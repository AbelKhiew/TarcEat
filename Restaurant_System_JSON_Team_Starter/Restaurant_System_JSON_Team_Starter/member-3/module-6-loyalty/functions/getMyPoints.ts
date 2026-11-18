"use server";

import type * as T from "@/shared/types";

/** Balance equals sum of points ledger entries.
 * Expected success data: number. Undefined means NOT IMPLEMENTED.
 */
export async function getMyPoints(): T.StubResult<number> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<number>> instead of T.StubResult.
}
