import type * as T from "@/shared/types";

/** Strict completed-module contract. Scaffold implementations are intentionally not assigned here yet. */
export interface CatalogService {
  /** List restaurant categories. */
  listCategories(restaurantId: T.ID): Promise<T.ServiceResult<T.Category[]>>;
  /** Create category for owned restaurant. */
  createCategory(restaurantId: T.ID, input: T.CategoryInput): Promise<T.ServiceResult<T.Category>>;
  /** Edit category. */
  updateCategory(categoryId: T.ID, input: T.CategoryInput): Promise<T.ServiceResult<T.Category>>;
  /** Reject deletion when active items still use the category. */
  deleteCategory(categoryId: T.ID): Promise<T.ServiceResult<null>>;
  /** List non-archived menu items for this restaurant. */
  listMenuItems(restaurantId: T.ID): Promise<T.ServiceResult<T.MenuItem[]>>;
  /** Check category belongs to same restaurant; positive price in sen. */
  createMenuItem(restaurantId: T.ID, input: T.MenuItemInput): Promise<T.ServiceResult<T.MenuItem>>;
  /** Edit current catalog only; do not change order snapshots. */
  updateMenuItem(itemId: T.ID, input: T.MenuItemInput): Promise<T.ServiceResult<T.MenuItem>>;
  /** Archive without destroying historical references. */
  archiveMenuItem(itemId: T.ID): Promise<T.ServiceResult<T.MenuItem>>;
  /** Toggle available or sold out. */
  setItemAvailability(itemId: T.ID, isAvailable: boolean): Promise<T.ServiceResult<T.MenuItem>>;
  /** Temporary image preview only; final uploads handled at integration. */
  previewMenuImage(file: File): Promise<T.ServiceResult<string>>;
}
