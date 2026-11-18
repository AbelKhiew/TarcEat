"use server";

import type * as T from "@/shared/types";

/** restaurantId null means platform. Validate role, scope and limits.
 * Expected success data: T.Voucher. Undefined means NOT IMPLEMENTED.
 */
export async function createVoucher(input: T.VoucherInput): T.StubResult<T.Voucher> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.Voucher>> instead of T.StubResult.
}
