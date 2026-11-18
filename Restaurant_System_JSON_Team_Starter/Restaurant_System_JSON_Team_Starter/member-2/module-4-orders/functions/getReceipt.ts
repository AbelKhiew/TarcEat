"use server";

import type * as T from "@/shared/types";

/** Authorised receipt read; preserve snapshot totals.
 * Expected success data: T.Receipt. Undefined means NOT IMPLEMENTED.
 */
export async function getReceipt(receiptId: T.ID): T.StubResult<T.Receipt> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.Receipt>> instead of T.StubResult.
}
