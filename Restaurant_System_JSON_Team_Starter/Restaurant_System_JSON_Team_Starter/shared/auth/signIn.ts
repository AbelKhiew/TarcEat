"use server";

import type * as T from "@/shared/types";

export async function signIn(input: T.SignInInput): T.StubResult<T.SessionContext> {
  // TODO: team lead implements per-user development session; not a global current-user JSON file.
}
