import "server-only";
import { readFile } from "node:fs/promises";
import type { CollectionName, RowOf } from "../types.ts";
import { getCollectionPath } from "./getCollectionPath.ts";

/** Internal primitive: writes call this inside withJsonLock. UI must use store. */
export async function readCollection<K extends CollectionName>(collection: K): Promise<RowOf<K>[]> {
  const data: unknown = JSON.parse(await readFile(getCollectionPath(collection), "utf8"));
  if (!Array.isArray(data) || data.some(row => !row || typeof row !== "object" || typeof row.id !== "string")) {
    throw new Error(`Invalid JSON collection: ${collection}`);
  }
  const ids = data.map(row => row.id);
  if (new Set(ids).size !== ids.length) throw new Error(`Duplicate IDs: ${collection}`);
  return data as RowOf<K>[];
}
