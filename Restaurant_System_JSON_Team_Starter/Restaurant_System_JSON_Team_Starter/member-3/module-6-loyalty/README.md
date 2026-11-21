# Module 6: Customer Profile & Loyalty Program

Owner: Member 3.

- `functions/`: one business function per file. Server Actions for this module.
- `screens/`: React screens for the existing routes. Apply shared theme classes.
- `contract.ts`: final function inputs and result types. Keep these stable.
- `index.ts`: import shortcut. No business logic here.

Read root START_HERE.md and docs/MEMBER_RULES.md first.
UI imports a function; the function runs on the local server and calls shared/storage.
The shared JSON store is already implemented. Do not add another mock or service layer.
Replace StubResult with Promise<ServiceResult<T>> as each function is completed.

## Functions

- [x] `registerCustomer.ts` → `T.Profile`
- [x] `getMyProfile.ts` → `T.Profile`
- [x] `updateMyProfile.ts` → `T.Profile`
- [x] `deactivateMyProfile.ts` → `null`
- [x] `getMyPoints.ts` → `number`
- [x] `listPointTransactions.ts` → `T.LoyaltyTransaction[]`
- [x] `listPlatformOffers.ts` → `T.Voucher[]`
- [ ] `claimPlatformVoucher.ts` → `T.CustomerVoucher`
- [x] `listMyVouchers.ts` → `T.CustomerVoucher[]`
- [x] `listManagedVouchers.ts` → `T.Voucher[]`
- [x] `createVoucher.ts` → `T.Voucher`
- [x] `updateVoucher.ts` → `T.Voucher`
- [x] `withdrawVoucher.ts` → `T.Voucher`
- [x] `previewVoucher.ts` → `T.VoucherPreview`
- [x] `getMyOrderHistory.ts` → `T.Order[]`

## Theme

Use `page`, `panel`, `button`, `button-secondary`, `field`, `notice`, `badge` and
`data-table` classes. Use variables from styles/theme.css, not hardcoded colours.

## Handover

Member name:
Finished functions: all checked public functions above.
Finished screens: customer registration and sign-in, profile, points, order history, voucher lists, and owner/admin voucher management.
Known gaps: atomic voucher claiming needs a shared transaction. Checkout redemption, cancellation reversal, and order completion points await the cross-module coordinators. Customer sign-in is available at /account.
Requested shared contract changes:
