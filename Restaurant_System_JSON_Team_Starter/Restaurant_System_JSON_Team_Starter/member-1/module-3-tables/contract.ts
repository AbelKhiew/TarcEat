import type * as T from "@/shared/types";

/** Strict completed-module contract. Scaffold implementations are intentionally not assigned here yet. */
export interface TablesService {
  /** Derive occupancy from current open visit. */
  listTables(restaurantId: T.ID): Promise<T.ServiceResult<T.RestaurantTable[]>>;
  /** Create one table; unique number within restaurant. */
  createTable(restaurantId: T.ID, input: T.TableInput): Promise<T.ServiceResult<T.RestaurantTable>>;
  /** Validate full batch before adding tables. */
  createTableBatch(restaurantId: T.ID, input: T.TableBatchInput): Promise<T.ServiceResult<T.RestaurantTable[]>>;
  /** Renumber without duplicates. */
  updateTable(tableId: T.ID, input: T.TableInput): Promise<T.ServiceResult<T.RestaurantTable>>;
  /** Create fresh unique QR token. */
  regenerateTableToken(tableId: T.ID): Promise<T.ServiceResult<T.RestaurantTable>>;
  /** Block if visit is open; retain historical references. */
  deleteTable(tableId: T.ID): Promise<T.ServiceResult<null>>;
  /** Return context only. Scanning must not create a visit. */
  validateTableToken(token: string): Promise<T.ServiceResult<T.TableContext>>;
  /** At most one open visit per table. */
  getCurrentTableVisit(tableId: T.ID): Promise<T.ServiceResult<T.TableVisit | null>>;
  /** Use current app origin and a restaurant-specific table token. */
  getTableQrUrl(tableId: T.ID): Promise<T.ServiceResult<string>>;
}
