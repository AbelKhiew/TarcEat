import "server-only";
import type * as T from "@/shared/types";

/** Integration-only helper. Expected data: T.LoyaltyTransaction | null. Work on the supplied snapshot.
 * No separate file writes here. Only a server coordinator may call this helper.
 */
export async function awardCompletionPoints(db: T.MockDatabase, input: T.CompletionPointsInput): T.StubResult<T.LoyaltyTransaction | null> {
  // TODO: implement with the team lead.
}
