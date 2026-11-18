"use server";

import type * as T from "@/shared/types";

/** Create one table; unique number within restaurant.
 * Expected success data: T.RestaurantTable. Undefined means NOT IMPLEMENTED.
 */
export async function createTable(restaurantId: T.ID, input: T.TableInput): T.StubResult<T.RestaurantTable> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.RestaurantTable>> instead of T.StubResult.
}
