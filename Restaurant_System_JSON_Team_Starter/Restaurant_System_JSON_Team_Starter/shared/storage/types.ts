import type { MockDatabase } from "@/shared/types";

export type CollectionName = Exclude<keyof MockDatabase, "schemaVersion">;
export type RowOf<K extends CollectionName> = MockDatabase[K][number];
export type RowFilter<K extends CollectionName> = Partial<RowOf<K>>;
export interface DataStore {
  list<K extends CollectionName>(collection: K, filter?: RowFilter<K>): Promise<RowOf<K>[]>;
  get<K extends CollectionName>(collection: K, id: string): Promise<RowOf<K> | null>;
  create<K extends CollectionName>(collection: K, row: RowOf<K>): Promise<RowOf<K>>;
  update<K extends CollectionName>(collection: K, id: string, patch: Partial<Omit<RowOf<K>, 'id'>>): Promise<RowOf<K>>;
  remove<K extends CollectionName>(collection: K, id: string): Promise<boolean>;
}
