import "server-only";
import type { CollectionName, RowOf } from "../types.ts";
import { listRows } from "./listRows.ts";

export async function getRow<K extends CollectionName>(collection: K, id: string): Promise<RowOf<K> | null> {
  return (await listRows(collection)).find(row => row.id === id) || null;
}
