"use server";

import type * as T from "@/shared/types";

/** Renumber without duplicates.
 * Expected success data: T.RestaurantTable. Undefined means NOT IMPLEMENTED.
 */
export async function updateTable(tableId: T.ID, input: T.TableInput): T.StubResult<T.RestaurantTable> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.RestaurantTable>> instead of T.StubResult.
}
