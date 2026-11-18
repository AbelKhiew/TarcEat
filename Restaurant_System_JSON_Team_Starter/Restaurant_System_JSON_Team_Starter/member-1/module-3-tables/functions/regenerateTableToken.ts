"use server";

import type * as T from "@/shared/types";

/** Create fresh unique QR token.
 * Expected success data: T.RestaurantTable. Undefined means NOT IMPLEMENTED.
 */
export async function regenerateTableToken(tableId: T.ID): T.StubResult<T.RestaurantTable> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.RestaurantTable>> instead of T.StubResult.
}
