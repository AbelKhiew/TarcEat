"use server";

import type * as T from "@/shared/types";

/** Derive occupancy from current open visit.
 * Expected success data: T.RestaurantTable[]. Undefined means NOT IMPLEMENTED.
 */
export async function listTables(restaurantId: T.ID): T.StubResult<T.RestaurantTable[]> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.RestaurantTable[]>> instead of T.StubResult.
}
