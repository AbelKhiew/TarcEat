import "server-only";
import path from "node:path";
import type { CollectionName } from "../types.ts";
import { COLLECTIONS } from "./collections.ts";

export function getCollectionPath(collection: CollectionName): string {
  if (!COLLECTIONS.includes(collection)) throw new Error("Unknown data collection");
  return path.join(process.env.RESTAURANT_JSON_DATA_DIR || path.join(process.cwd(), "data"), collection + ".json");
}
