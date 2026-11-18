import 'server-only';

const state = globalThis as typeof globalThis & { restaurantMemberOneQueue?: Promise<unknown> };

/** Serialize Member 1 mutations in the local Node process. Store operations have their own file queue. */
export async function serializeChanges<T>(work: () => Promise<T>): Promise<T> {
  const next = (state.restaurantMemberOneQueue ?? Promise.resolve()).then(work);
  state.restaurantMemberOneQueue = next.then(() => undefined, () => undefined);
  return next;
}
