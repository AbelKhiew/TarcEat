# Shopping Cart & Checkout Gateway

Owner: Lim Jinming (Member 2). Local JSON demonstration implementation.

## Files

- `functions/`: 7 business functions, one function per file.
- `screens/`: user interface components following the team TABLE & CO theme.
- `contract.ts`: agreed input/output interfaces.
- `index.ts`: function exports.
- `../internal/`: shared validation, price and completion helpers.

## Completed functions (JSON development stage)

- [x] `addCartItem.ts`
- [x] `clearCart.ts`
- [x] `createCart.ts`
- [x] `getCart.ts`
- [x] `previewCheckout.ts`
- [x] `removeCartItem.ts`
- [x] `updateCartItem.ts`

## Screens

- `CartLineEditor.tsx`
- `CartView.tsx`
- `CheckoutSummary.tsx`
- `DeliveryCheckoutForm.tsx`
- `DineInCheckoutForm.tsx`
- `PickupCheckoutForm.tsx`
- `SimulatedPaymentSection.tsx`
- `VoucherPicker.tsx`

## Notes

- Run `npm run check` after installing dependencies.
- Testing: 34 isolated service checks passed in the authoring environment; real Next.js browser/build still needs user verification.
- Supabase / multi-file database transactions are **not yet integrated**.
- See `member-2/VSCode_Git_Guide.md` and `member-2/CODE_EXPLANATION_ZH.md`.
