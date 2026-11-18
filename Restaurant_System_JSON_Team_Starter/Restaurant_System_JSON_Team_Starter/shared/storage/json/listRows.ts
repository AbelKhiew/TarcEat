import "server-only";
import type { CollectionName, RowOf, RowFilter } from "../types.ts";
import { readCollection } from "./readCollection.ts";
import { withJsonLock } from "./withJsonLock.ts";

export async function listRows<K extends CollectionName>(collection: K, filter: RowFilter<K> = {}): Promise<RowOf<K>[]> {
  return withJsonLock(async () => {
    const rows = await readCollection(collection);
    return rows.filter(row => Object.entries(filter).every(([key, value]) => Reflect.get(row, key) === value));
  });
}
