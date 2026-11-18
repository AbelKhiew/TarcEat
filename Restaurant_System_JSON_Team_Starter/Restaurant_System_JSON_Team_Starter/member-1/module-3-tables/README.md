# Module 3: Physical Table & QR Code Engine

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

- [ ] `listTables.ts` → `T.RestaurantTable[]`
- [ ] `createTable.ts` → `T.RestaurantTable`
- [ ] `createTableBatch.ts` → `T.RestaurantTable[]`
- [ ] `updateTable.ts` → `T.RestaurantTable`
- [ ] `regenerateTableToken.ts` → `T.RestaurantTable`
- [ ] `deleteTable.ts` → `null`
- [ ] `validateTableToken.ts` → `T.TableContext`
- [ ] `getCurrentTableVisit.ts` → `T.TableVisit | null`
- [ ] `getTableQrUrl.ts` → `string`

## Theme

Use `page`, `panel`, `button`, `button-secondary`, `field`, `notice`, `badge` and
`data-table` classes. Use variables from styles/theme.css, not hardcoded colours.

## Handover

Member name:
Finished functions:
Finished screens:
Known gaps:
Requested shared contract changes:
