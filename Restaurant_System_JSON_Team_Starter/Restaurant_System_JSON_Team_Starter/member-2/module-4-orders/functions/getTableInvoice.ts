"use server";

import type * as T from "@/shared/types";

/** Expose whole current table bill without personal customer contact information.
 * Expected success data: T.TableInvoice. Undefined means NOT IMPLEMENTED.
 */
export async function getTableInvoice(tableToken: string): T.StubResult<T.TableInvoice> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.TableInvoice>> instead of T.StubResult.
}
