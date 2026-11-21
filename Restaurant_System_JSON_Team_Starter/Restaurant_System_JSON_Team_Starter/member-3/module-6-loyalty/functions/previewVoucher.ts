"use server";

import type * as T from "@/shared/types";

/** Require customer sign-in, scope, expiry, minimum spend and use-limit checks.
 * Expected success data: T.VoucherPreview. Undefined means NOT IMPLEMENTED.
 */
export async function previewVoucher(input: T.VoucherPreviewInput): T.StubResult<T.VoucherPreview> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.VoucherPreview>> instead of T.StubResult.
}
