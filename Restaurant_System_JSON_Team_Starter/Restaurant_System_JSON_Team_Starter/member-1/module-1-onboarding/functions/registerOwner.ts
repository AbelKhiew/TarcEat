"use server";

import type * as T from "@/shared/types";

/** Register an owner directly; do not wait for Root Admin approval.
 * Expected success data: T.Profile. Undefined means NOT IMPLEMENTED.
 */
export async function registerOwner(input: T.RegisterAccountInput): T.StubResult<T.Profile> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.Profile>> instead of T.StubResult.
}
