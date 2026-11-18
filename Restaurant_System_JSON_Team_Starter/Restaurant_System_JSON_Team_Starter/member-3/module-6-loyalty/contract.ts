import type * as T from "@/shared/types";

/** Strict completed-module contract. Scaffold implementations are intentionally not assigned here yet. */
export interface LoyaltyService {
  /** Create customer and loyalty account; separate from owner registration. */
  registerCustomer(input: T.RegisterAccountInput): Promise<T.ServiceResult<T.Profile>>;
  /** Read signed-in profile. */
  getMyProfile(): Promise<T.ServiceResult<T.Profile>>;
  /** Validate details. */
  updateMyProfile(input: T.ProfileUpdateInput): Promise<T.ServiceResult<T.Profile>>;
  /** Deactivate without deleting transaction history. */
  deactivateMyProfile(): Promise<T.ServiceResult<null>>;
  /** Balance equals sum of points ledger entries. */
  getMyPoints(): Promise<T.ServiceResult<number>>;
  /** Customer ledger history. */
  listPointTransactions(): Promise<T.ServiceResult<T.LoyaltyTransaction[]>>;
  /** Platform vouchers claimable with points. */
  listPlatformOffers(): Promise<T.ServiceResult<T.Voucher[]>>;
  /** Atomically deduct points and create claim. */
  claimPlatformVoucher(voucherId: T.ID): Promise<T.ServiceResult<T.CustomerVoucher>>;
  /** Claim status and use limits. */
  listMyVouchers(): Promise<T.ServiceResult<T.CustomerVoucher[]>>;
  /** Owner for matching restaurant, Root Admin for platform vouchers. */
  listManagedVouchers(restaurantId: T.ID | null): Promise<T.ServiceResult<T.Voucher[]>>;
  /** restaurantId null means platform. Validate role, scope and limits. */
  createVoucher(input: T.VoucherInput): Promise<T.ServiceResult<T.Voucher>>;
  /** Separate claimEnabled from isUsable. */
  updateVoucher(voucherId: T.ID, input: T.VoucherInput): Promise<T.ServiceResult<T.Voucher>>;
  /** Stop new claims; do not automatically disable existing claimed vouchers. */
  withdrawVoucher(voucherId: T.ID): Promise<T.ServiceResult<T.Voucher>>;
  /** Require customer sign-in, scope, expiry, minimum spend and use-limit checks. */
  previewVoucher(input: T.VoucherPreviewInput): Promise<T.ServiceResult<T.VoucherPreview>>;
  /** Read Module 4 records; do not duplicate order storage. */
  getMyOrderHistory(): Promise<T.ServiceResult<T.Order[]>>;
}
