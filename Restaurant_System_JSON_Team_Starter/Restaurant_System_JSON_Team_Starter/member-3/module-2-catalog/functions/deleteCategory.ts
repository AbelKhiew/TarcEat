"use server";

import type * as T from "@/shared/types";

/** Reject deletion when active items still use the category.
 * Expected success data: null. Undefined means NOT IMPLEMENTED.
 */
export async function deleteCategory(categoryId: T.ID): T.StubResult<null> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<null>> instead of T.StubResult.
}
