"use server";

import type * as T from "@/shared/types";

/** One Finish / Paid. Complete remaining Ready orders, close visit, award points once and create one receipt atomically. Retry returns existing receipt.
 * Expected success data: T.Receipt. Undefined means NOT IMPLEMENTED.
 */
export async function finishTableVisit(visitId: T.ID): T.StubResult<T.Receipt> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.Receipt>> instead of T.StubResult.
}
