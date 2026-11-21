"use server";

import type * as T from "@/shared/types";

/** Provide restaurant charges, ownership and new-order eligibility.
 * Expected success data: T.RestaurantContext. Undefined means NOT IMPLEMENTED.
 */
export async function getRestaurantContext(restaurantId: T.ID): T.StubResult<T.RestaurantContext> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.RestaurantContext>> instead of T.StubResult.
}
