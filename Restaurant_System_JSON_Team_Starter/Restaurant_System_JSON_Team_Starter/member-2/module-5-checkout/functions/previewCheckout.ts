"use server";

import type * as T from "@/shared/types";

/** Preview only. Module 4 revalidates and creates final order. At most one voucher.
 * Expected success data: T.CheckoutPreview. Undefined means NOT IMPLEMENTED.
 */
export async function previewCheckout(input: T.CheckoutInput): T.StubResult<T.CheckoutPreview> {
  // TODO: validate role, ownership and input first.
  // TODO: read/add/update/delete through @/shared/storage only.
  // Keep this file as ONE business function. No fs, localStorage or Supabase here.
  // When finished: return Promise<T.ServiceResult<T.CheckoutPreview>> instead of T.StubResult.
}
