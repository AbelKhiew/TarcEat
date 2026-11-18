# Module 4: Multi-Channel Order Fulfillment

Owner: Member 2.

- `functions/`: one business function per file. EMPTY bodies, ready to implement.
- `screens/`: blank React UI placeholders. Apply shared theme classes.
- `contract.ts`: final function inputs and result types. Keep these stable.
- `index.ts`: import shortcut. No business logic here.

Read root START_HERE.md and docs/MEMBER_RULES.md first.
UI imports a function; the function runs on the local server and calls shared/storage.
The shared JSON store is already implemented. Do not add another mock or service layer.
Replace StubResult with Promise<ServiceResult<T>> as each function is completed.

## Functions

- [ ] `listMyOrders.ts` → `T.Order[]`
- [ ] `submitOrder.ts` → `T.SubmitOrderOutput`
- [ ] `listRestaurantOrders.ts` → `T.Order[]`
- [ ] `getOrder.ts` → `T.OrderDetails`
- [ ] `updateOrderStatus.ts` → `T.Order`
- [ ] `requestCancellation.ts` → `T.Order`
- [ ] `decideCancellation.ts` → `T.Order`
- [ ] `getTableInvoice.ts` → `T.TableInvoice`
- [ ] `finishTableVisit.ts` → `T.Receipt`
- [ ] `completeTakeawayOrder.ts` → `T.Order`
- [ ] `getReceipt.ts` → `T.Receipt`
- [ ] `archiveOrder.ts` → `T.Order`

## Theme

Use `page`, `panel`, `button`, `button-secondary`, `field`, `notice`, `badge` and
`data-table` classes. Use variables from styles/theme.css, not hardcoded colours.

## Handover

Member name:
Finished functions:
Finished screens:
Known gaps:
Requested shared contract changes:
