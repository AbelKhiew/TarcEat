import "server-only";
import type * as T from "@/shared/types";

/** Integration-only helper. Expected data: T.TableVisit. Work on the supplied snapshot.
 * No separate file writes here. Only a server coordinator may call this helper.
 */
export async function closeVisit(db: T.MockDatabase, visitId: T.ID): T.StubResult<T.TableVisit> {
  // TODO: implement with the team lead.
}
