import "server-only";

const state = globalThis as typeof globalThis & { __restaurantJsonQueue?: Promise<unknown> };

/** One queue for a single local Node.js process. Not a distributed database lock. */
export async function withJsonLock<T>(work: () => Promise<T>): Promise<T> {
  const previous = state.__restaurantJsonQueue || Promise.resolve();
  const result = previous.catch(() => undefined).then(work);
  state.__restaurantJsonQueue = result.then(() => undefined, () => undefined);
  return result;
}
