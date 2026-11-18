# Module 1: Restaurant Profile & Store Onboarding

Owner: Member 1.

- `functions/`: one business function per file. EMPTY bodies, ready to implement.
- `screens/`: blank React UI placeholders. Apply shared theme classes.
- `contract.ts`: final function inputs and result types. Keep these stable.
- `index.ts`: import shortcut. No business logic here.

Read root START_HERE.md and docs/MEMBER_RULES.md first.
UI imports a function; the function runs on the local server and calls shared/storage.
The shared JSON store is already implemented. Do not add another mock or service layer.
Replace StubResult with Promise<ServiceResult<T>> as each function is completed.

## Functions

- [ ] `registerOwner.ts` → `T.Profile`
- [ ] `submitRestaurantApplication.ts` → `T.RestaurantApplication`
- [ ] `listMyApplications.ts` → `T.RestaurantApplication[]`
- [ ] `listPendingApplications.ts` → `T.RestaurantApplication[]`
- [ ] `approveRestaurantApplication.ts` → `T.Restaurant`
- [ ] `rejectRestaurantApplication.ts` → `T.RestaurantApplication`
- [ ] `deleteRejectedApplication.ts` → `null`
- [ ] `listMyRestaurants.ts` → `T.Restaurant[]`
- [ ] `listPublicRestaurants.ts` → `T.Restaurant[]`
- [ ] `listAllRestaurants.ts` → `T.Restaurant[]`
- [ ] `updateRestaurant.ts` → `T.Restaurant`
- [ ] `setRestaurantStatus.ts` → `T.Restaurant`
- [ ] `archiveRestaurant.ts` → `T.Restaurant`
- [ ] `getRestaurantContext.ts` → `T.RestaurantContext`

## Theme

Use `page`, `panel`, `button`, `button-secondary`, `field`, `notice`, `badge` and
`data-table` classes. Use variables from styles/theme.css, not hardcoded colours.

## Handover

Member name:
Finished functions:
Finished screens:
Known gaps:
Requested shared contract changes:
