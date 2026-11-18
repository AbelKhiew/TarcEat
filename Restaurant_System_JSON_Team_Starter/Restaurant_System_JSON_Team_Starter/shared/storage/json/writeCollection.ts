import "server-only";
import { writeFile, rename, rm } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import type { CollectionName, RowOf } from "../types.ts";
import { getCollectionPath } from "./getCollectionPath.ts";

/** Internal primitive. Call only while holding withJsonLock. Atomic replacement per file. */
export async function writeCollection<K extends CollectionName>(collection: K, rows: RowOf<K>[]): Promise<void> {
  const target = getCollectionPath(collection);
  const temporary = target + "." + randomUUID() + ".tmp";
  try {
    await writeFile(temporary, JSON.stringify(rows, null, 2) + "\n", { encoding: "utf8", flag: "wx" });
    await rename(temporary, target);
  } finally {
    await rm(temporary, { force: true });
  }
}
