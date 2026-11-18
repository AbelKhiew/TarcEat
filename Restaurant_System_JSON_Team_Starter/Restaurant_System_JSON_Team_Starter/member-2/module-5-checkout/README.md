# Module 5: Shopping Cart & Checkout Gateway

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

- [ ] `getCart.ts` → `T.Cart | null`
- [ ] `createCart.ts` → `T.Cart`
- [ ] `addCartItem.ts` → `T.Cart`
- [ ] `updateCartItem.ts` → `T.Cart`
- [ ] `removeCartItem.ts` → `T.Cart`
- [ ] `clearCart.ts` → `T.Cart`
- [ ] `previewCheckout.ts` → `T.CheckoutPreview`

## Theme

Use `page`, `panel`, `button`, `button-secondary`, `field`, `notice`, `badge` and
`data-table` classes. Use variables from styles/theme.css, not hardcoded colours.

## Handover

Member name:
Finished functions:
Finished screens:
Known gaps:
Requested shared contract changes:
