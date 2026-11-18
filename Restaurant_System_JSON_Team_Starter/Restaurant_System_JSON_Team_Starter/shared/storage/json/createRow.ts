import "server-only";
import type { CollectionName, RowOf } from "../types.ts";
import { readCollection } from "./readCollection.ts";
import { writeCollection } from "./writeCollection.ts";
import { withJsonLock } from "./withJsonLock.ts";

export async function createRow<K extends CollectionName>(collection: K, row: RowOf<K>): Promise<RowOf<K>> {
  return withJsonLock(async () => {
    if (!row || typeof row.id !== "string" || !row.id.trim()) throw new Error("Row needs a string ID");
    const rows = await readCollection(collection);
    if (rows.some(existing => existing.id === row.id)) throw new Error("Duplicate row ID");
    await writeCollection(collection, [...rows, row]);
    return row;
  });
}
