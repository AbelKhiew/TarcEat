"use server";

import type * as T from "@/shared/types";

/** Customer ledger history.
 * Expected success data: T.LoyaltyTransaction[]. Undefined means NOT IMPLEMENTED.
 */
export async function listPointTransactions(): T.StubResult<T.LoyaltyTransaction[]> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.LoyaltyTransaction[]>> instead of T.StubResult.
}
