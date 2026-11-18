import "server-only";
import type { CollectionName, RowOf } from "../types.ts";
import { readCollection } from "./readCollection.ts";
import { writeCollection } from "./writeCollection.ts";
import { withJsonLock } from "./withJsonLock.ts";

export async function updateRow<K extends CollectionName>(collection: K, id: string, patch: Partial<Omit<RowOf<K>, "id">>): Promise<RowOf<K>> {
  return withJsonLock(async () => {
    const rows = await readCollection(collection);
    const index = rows.findIndex(row => row.id === id);
    if (index < 0) throw new Error("Row not found");
    const updated = { ...rows[index], ...patch, id } as RowOf<K>;
    rows[index] = updated;
    await writeCollection(collection, rows);
    return updated;
  });
}
