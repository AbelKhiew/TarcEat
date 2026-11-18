# Module 6: Customer Profile & Loyalty Program

Owner: Member 3.

- `functions/`: one business function per file. EMPTY bodies, ready to implement.
- `screens/`: blank React UI placeholders. Apply shared theme classes.
- `contract.ts`: final function inputs and result types. Keep these stable.
- `index.ts`: import shortcut. No business logic here.

Read root START_HERE.md and docs/MEMBER_RULES.md first.
UI imports a function; the function runs on the local server and calls shared/storage.
The shared JSON store is already implemented. Do not add another mock or service layer.
Replace StubResult with Promise<ServiceResult<T>> as each function is completed.

## Functions

- [ ] `registerCustomer.ts` → `T.Profile`
- [ ] `getMyProfile.ts` → `T.Profile`
- [ ] `updateMyProfile.ts` → `T.Profile`
- [ ] `deactivateMyProfile.ts` → `null`
- [ ] `getMyPoints.ts` → `number`
- [ ] `listPointTransactions.ts` → `T.LoyaltyTransaction[]`
- [ ] `listPlatformOffers.ts` → `T.Voucher[]`
- [ ] `claimPlatformVoucher.ts` → `T.CustomerVoucher`
- [ ] `listMyVouchers.ts` → `T.CustomerVoucher[]`
- [ ] `listManagedVouchers.ts` → `T.Voucher[]`
- [ ] `createVoucher.ts` → `T.Voucher`
- [ ] `updateVoucher.ts` → `T.Voucher`
- [ ] `withdrawVoucher.ts` → `T.Voucher`
- [ ] `previewVoucher.ts` → `T.VoucherPreview`
- [ ] `getMyOrderHistory.ts` → `T.Order[]`

## Theme

Use `page`, `panel`, `button`, `button-secondary`, `field`, `notice`, `badge` and
`data-table` classes. Use variables from styles/theme.css, not hardcoded colours.

## Handover

Member name:
Finished functions:
Finished screens:
Known gaps:
Requested shared contract changes:
