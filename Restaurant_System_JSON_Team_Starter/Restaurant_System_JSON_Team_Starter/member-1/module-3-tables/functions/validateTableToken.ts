"use server";

import type * as T from "@/shared/types";

/** Return context only. Scanning must not create a visit.
 * Expected success data: T.TableContext. Undefined means NOT IMPLEMENTED.
 */
export async function validateTableToken(token: string): T.StubResult<T.TableContext> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.TableContext>> instead of T.StubResult.
}
