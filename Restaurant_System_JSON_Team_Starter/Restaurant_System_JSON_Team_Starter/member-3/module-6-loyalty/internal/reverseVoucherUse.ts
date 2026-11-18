import "server-only";
import type * as T from "@/shared/types";

/** Integration-only helper. Expected data: null. Work on the supplied snapshot.
 * No separate file writes here. Only a server coordinator may call this helper.
 */
export async function reverseVoucherUse(db: T.MockDatabase, orderId: T.ID): T.StubResult<null> {
  // TODO: implement with the team lead.
}
