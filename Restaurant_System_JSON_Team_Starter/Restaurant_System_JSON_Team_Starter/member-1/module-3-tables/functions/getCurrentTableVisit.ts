"use server";

import type * as T from "@/shared/types";

/** At most one open visit per table.
 * Expected success data: T.TableVisit | null. Undefined means NOT IMPLEMENTED.
 */
export async function getCurrentTableVisit(tableId: T.ID): T.StubResult<T.TableVisit | null> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.TableVisit | null>> instead of T.StubResult.
}
