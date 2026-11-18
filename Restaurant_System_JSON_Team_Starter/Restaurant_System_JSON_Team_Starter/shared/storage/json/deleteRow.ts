import "server-only";
import type { CollectionName } from "../types.ts";
import { readCollection } from "./readCollection.ts";
import { writeCollection } from "./writeCollection.ts";
import { withJsonLock } from "./withJsonLock.ts";

/** Low-level removal. Domain functions decide whether hard deletion is allowed. */
export async function deleteRow<K extends CollectionName>(collection: K, id: string): Promise<boolean> {
  return withJsonLock(async () => {
    const rows = await readCollection(collection);
    const next = rows.filter(row => row.id !== id);
    if (next.length === rows.length) return false;
    await writeCollection(collection, next);
    return true;
  });
}
