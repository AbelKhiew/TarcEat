import "server-only";
import type { DataStore } from "./types.ts";
import { listRows } from "./json/listRows.ts";
import { getRow } from "./json/getRow.ts";
import { createRow } from "./json/createRow.ts";
import { updateRow } from "./json/updateRow.ts";
import { deleteRow } from "./json/deleteRow.ts";

/** Development uses actual JSON files. Later replace this adapter with Supabase. */
export const store: DataStore = {
  list: listRows,
  get: getRow,
  create: createRow,
  update: updateRow,
  remove: deleteRow,
};
