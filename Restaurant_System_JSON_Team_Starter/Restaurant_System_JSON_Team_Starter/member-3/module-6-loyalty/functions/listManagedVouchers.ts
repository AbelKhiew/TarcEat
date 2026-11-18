"use server";

import type * as T from "@/shared/types";

/** Owner for matching restaurant, Root Admin for platform vouchers.
 * Expected success data: T.Voucher[]. Undefined means NOT IMPLEMENTED.
 */
export async function listManagedVouchers(restaurantId: T.ID | null): T.StubResult<T.Voucher[]> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.Voucher[]>> instead of T.StubResult.
}
