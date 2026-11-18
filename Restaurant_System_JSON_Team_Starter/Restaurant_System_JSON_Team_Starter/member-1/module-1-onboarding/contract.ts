import type * as T from "@/shared/types";

/** Strict completed-module contract. Scaffold implementations are intentionally not assigned here yet. */
export interface OnboardingService {
  /** Register an owner directly; do not wait for Root Admin approval. */
  registerOwner(input: T.RegisterAccountInput): Promise<T.ServiceResult<T.Profile>>;
  /** Read applicant owner from shared session; never accept arbitrary owner IDs from a form. */
  submitRestaurantApplication(input: T.RestaurantApplicationInput): Promise<T.ServiceResult<T.RestaurantApplication>>;
  /** Return applications for the signed-in owner. */
  listMyApplications(): Promise<T.ServiceResult<T.RestaurantApplication[]>>;
  /** Root Admin review queue. */
  listPendingApplications(): Promise<T.ServiceResult<T.RestaurantApplication[]>>;
  /** Link approved restaurant to existing applicant owner. Approval must be repeat-safe. */
  approveRestaurantApplication(applicationId: T.ID): Promise<T.ServiceResult<T.Restaurant>>;
  /** Reject restaurant application; preserve owner account. */
  rejectRestaurantApplication(applicationId: T.ID, reason: string): Promise<T.ServiceResult<T.RestaurantApplication>>;
  /** Delete an eligible rejected application. */
  deleteRejectedApplication(applicationId: T.ID): Promise<T.ServiceResult<null>>;
  /** One owner may manage multiple restaurants. */
  listMyRestaurants(): Promise<T.ServiceResult<T.Restaurant[]>>;
  /** Return approved, active restaurants for search; show operating status. */
  listPublicRestaurants(): Promise<T.ServiceResult<T.Restaurant[]>>;
  /** Root Admin restaurant list. */
  listAllRestaurants(): Promise<T.ServiceResult<T.Restaurant[]>>;
  /** Validate restaurant ownership. */
  updateRestaurant(restaurantId: T.ID, input: T.RestaurantUpdateInput): Promise<T.ServiceResult<T.Restaurant>>;
  /** Root Admin only. Suspension blocks new orders, not completion of existing orders. */
  setRestaurantStatus(restaurantId: T.ID, status: T.RestaurantStatus): Promise<T.ServiceResult<T.Restaurant>>;
  /** Preserve historical orders and receipts. */
  archiveRestaurant(restaurantId: T.ID): Promise<T.ServiceResult<T.Restaurant>>;
  /** Provide restaurant charges, ownership and new-order eligibility. */
  getRestaurantContext(restaurantId: T.ID): Promise<T.ServiceResult<T.RestaurantContext>>;
}
