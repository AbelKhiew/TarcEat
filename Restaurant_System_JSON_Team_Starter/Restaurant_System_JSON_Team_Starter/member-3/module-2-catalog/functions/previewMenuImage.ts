"use server";

import type * as T from "@/shared/types";

/** Temporary image preview only; final uploads handled at integration.
 * Expected success data: string. Undefined means NOT IMPLEMENTED.
 */
export async function previewMenuImage(file: File): T.StubResult<string> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<string>> instead of T.StubResult.
}
