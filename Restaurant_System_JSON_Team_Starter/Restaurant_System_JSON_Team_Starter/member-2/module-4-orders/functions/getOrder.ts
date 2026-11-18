"use server";

import type * as T from "@/shared/types";

/** Check signed-in customer/owner or guest tracking token.
 * Expected success data: T.OrderDetails. Undefined means NOT IMPLEMENTED.
 */
export async function getOrder(input: T.TrackingInput): T.StubResult<T.OrderDetails> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.OrderDetails>> instead of T.StubResult.
}
