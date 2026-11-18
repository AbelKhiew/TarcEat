"use server";

import type * as T from "@/shared/types";

/** Atomically deduct points and create claim.
 * Expected success data: T.CustomerVoucher. Undefined means NOT IMPLEMENTED.
 */
export async function claimPlatformVoucher(voucherId: T.ID): T.StubResult<T.CustomerVoucher> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.CustomerVoucher>> instead of T.StubResult.
}
