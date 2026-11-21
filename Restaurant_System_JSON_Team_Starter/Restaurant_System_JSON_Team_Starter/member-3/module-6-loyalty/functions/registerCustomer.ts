"use server";

import type * as T from "@/shared/types";

/** Create customer and loyalty account; separate from owner registration.
 * Expected success data: T.Profile. Undefined means NOT IMPLEMENTED.
 */
export async function registerCustomer(input: T.RegisterAccountInput): T.StubResult<T.Profile> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.Profile>> instead of T.StubResult.
}
