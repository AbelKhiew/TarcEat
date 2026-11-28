# Multi-Channel Order Fulfillment

Owner: Lim Jinming (Member 2). Local JSON demonstration implementation.

## Files

- `functions/`: 12 business functions, one function per file.
- `screens/`: user interface components following the team TABLE & CO theme.
- `contract.ts`: agreed input/output interfaces.
- `index.ts`: function exports.
- `../internal/`: shared validation, price and completion helpers.

## Completed functions (JSON development stage)

- [x] `archiveOrder.ts`
- [x] `completeTakeawayOrder.ts`
- [x] `decideCancellation.ts`
- [x] `finishTableVisit.ts`
- [x] `getOrder.ts`
- [x] `getReceipt.ts`
- [x] `getTableInvoice.ts`
- [x] `listMyOrders.ts`
- [x] `listRestaurantOrders.ts`
- [x] `requestCancellation.ts`
- [x] `submitOrder.ts`
- [x] `updateOrderStatus.ts`

## Screens

- `CancellationRequestForm.tsx`
- `CancellationReviewPanel.tsx`
- `CustomerOrderTracker.tsx`
- `KitchenQueue.tsx`
- `OrderDetailsPanel.tsx`
- `OrderStatusControls.tsx`
- `ReceiptPrintActions.tsx`
- `ReceiptView.tsx`
- `TableInvoice.tsx`

## Notes

- Run `npm run check` after installing dependencies.
- Testing: 34 isolated service checks passed in the authoring environment; real Next.js browser/build still needs user verification.
- Supabase / multi-file database transactions are **not yet integrated**.
- See `member-2/VSCode_Git_Guide.md` and `member-2/CODE_EXPLANATION_ZH.md`.
