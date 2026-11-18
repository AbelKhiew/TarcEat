"use server";

import type * as T from "@/shared/types";

/** Reject restaurant application; preserve owner account.
 * Expected success data: T.RestaurantApplication. Undefined means NOT IMPLEMENTED.
 */
export async function rejectRestaurantApplication(applicationId: T.ID, reason: string): T.StubResult<T.RestaurantApplication> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.RestaurantApplication>> instead of T.StubResult.
}
