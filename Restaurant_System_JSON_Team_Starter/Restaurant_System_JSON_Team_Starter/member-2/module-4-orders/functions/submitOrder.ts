"use server";

import type * as T from "@/shared/types";

/** Only order creator. Validate current catalog, restaurant, table and voucher; use request ID to prevent duplicates.
 * Expected success data: T.SubmitOrderOutput. Undefined means NOT IMPLEMENTED.
 */
export async function submitOrder(input: T.CheckoutInput): T.StubResult<T.SubmitOrderOutput> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.SubmitOrderOutput>> instead of T.StubResult.
}
