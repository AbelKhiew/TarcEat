import "server-only";
import type * as T from "@/shared/types";

/** Integration-only helper. Expected data: T.MenuItem[]. Work on the supplied snapshot.
 * No separate file writes here. Only a server coordinator may call this helper.
 */
export async function validateOrderItems(db: T.MockDatabase, restaurantId: T.ID, lines: T.CartLine[]): T.StubResult<T.MenuItem[]> {
  // TODO: implement with the team lead.
}
