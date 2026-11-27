import 'server-only';
const globals = globalThis as typeof globalThis & { memberTwoQueue?: Promise<unknown> };
/** Local demonstration only; this is NOT a multi-file database transaction. */
export async function serializeMemberTwo<T>(work: () => Promise<T>): Promise<T> {
  const promise = (globals.memberTwoQueue ?? Promise.resolve()).then(work);
  globals.memberTwoQueue = promise.then(() => undefined, () => undefined);
  return promise;
}
