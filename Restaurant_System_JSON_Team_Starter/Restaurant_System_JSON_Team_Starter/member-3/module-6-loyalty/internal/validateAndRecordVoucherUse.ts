import "server-only";
import type * as T from "@/shared/types";

/** Integration-only helper. Expected data: T.VoucherRedemption. Work on the supplied snapshot.
 * No separate file writes here. Only a server coordinator may call this helper.
 */
export async function validateAndRecordVoucherUse(db: T.MockDatabase, input: T.RecordVoucherUseInput): T.StubResult<T.VoucherRedemption> {
  // TODO: implement with the team lead.
}
