"use server";

import type * as T from "@/shared/types";

/** Use current app origin and a restaurant-specific table token.
 * Expected success data: string. Undefined means NOT IMPLEMENTED.
 */
export async function getTableQrUrl(tableId: T.ID): T.StubResult<string> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<string>> instead of T.StubResult.
}
