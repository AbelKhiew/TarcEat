# TarcEat — VS Code, GitHub and Code Explanation (Lim Jinming)

This package is based on the uploaded **TarcEat-main(2).zip** from 25 November 2026.
Only `member-2/` and the integration button in `app/menu/page.tsx` were edited.
Other members' existing modules are unchanged.

## A. Prepare Windows

1. Install **Visual Studio Code**, **Git for Windows** and **Node.js 22+ LTS**.
2. Open **VS Code → Terminal → New Terminal**.
3. Verify these commands in PowerShell:

```powershell
node -v
npm.cmd -v
git --version
```

If `npm -v` says PowerShell scripts are disabled, use `npm.cmd`, not `npm`.

## B. Download your group repository — FIRST TIME

1. Open an empty folder such as `C:\Users\user\Desktop\MiniProject` in VS Code.
2. In the VS Code Terminal:

```powershell
git clone https://github.com/AbelKhiew/TarcEat.git
cd TarcEat
git switch main
git pull --ff-only origin main
git switch -c jinming/module4-module5
```

If you get **Repository not found / Permission denied**, ask your group leader to add your GitHub account as a collaborator. If `main` does not exist, check the actual branch name with `git branch -a`.

## C. Copy only your code into GitHub clone

Use `TarcEat_Copy_Only_M4_M5.zip` (recommended) and extract it somewhere temporary.

Its contents start with:

```text
member-2/
  module-4-orders/
  module-5-checkout/
  internal/
  README_FOR_JINMING.md
app/
  menu/
    page.tsx
```

Open the *inner* project folder:

```text
TarcEat/
└── Restaurant_System_JSON_Team_Starter/
    └── Restaurant_System_JSON_Team_Starter/   <-- open THIS one in VS Code
        ├── package.json
        ├── app/
        ├── data/
        ├── member-1/
        ├── member-2/
        ├── member-3/
        └── shared/
```

Copy `member-2/` from the patch into the inner project's `member-2/` folder, replacing the old stubs.
Copy `app/menu/page.tsx` into the existing `app/menu/page.tsx` (this is a small shared route change; tell your leader).
**Do NOT** copy a second folder named `Restaurant_System_JSON_Team_Starter` inside the first.

## D. Run in VS Code

Make sure the Terminal is at the folder where `package.json` exists:

```powershell
cd Restaurant_System_JSON_Team_Starter\Restaurant_System_JSON_Team_Starter
npm.cmd ci
npm.cmd run check
npm.cmd run dev
```

If you are already inside that folder, don't `cd` again.
Open `http://localhost:3000` only after `npm.cmd run dev` says the server is ready.
If you need another port, Next may use 3001; follow the Terminal URL.

Suggested demo pages:

- `http://localhost:3000/cart` — pick restaurant, Pickup/Delivery/Dine-in, add items.
- `http://localhost:3000/checkout?cart=<generated-cart-id>` — opened through Cart button.
- `http://localhost:3000/order-status?order=<order-id>&token=<token>` — opened after guest checkout.
- `http://localhost:3000/owner/orders` — sign in as demo owner first.
- `http://localhost:3000/owner/invoices` — Dine-in shared bill and Finish/Paid.

Owner demo login on `/login`:

```text
Email: sarah.owner@example.test
Password: Demo12345
```

For customer/guest testing, use an incognito window so owner login cookies don't interfere. The database seed has fictional restaurants, including Jade Bowl Kitchen.

## E. How to PUSH your work safely

Run commands from *the inner project folder* after you copied and tested your own files.

```powershell
git status
git add member-2 app/menu/page.tsx
git commit -m "Implement module 4 order and module 5 checkout demo"
git push -u origin jinming/module4-module5
```

Then open your GitHub repository website → **Compare & pull request** → choose `main` as the target → create Pull Request → ask your group leader to review and merge.
Do NOT push directly into `main` unless your team explicitly asks.
If Git says `Author identity unknown`, set your **own** details:

```powershell
git config user.name "YOUR GITHUB NAME"
git config user.email "YOUR GITHUB EMAIL"
```

Never commit `.env.local`, passwords, `node_modules` or generated `.next` files. Check `git status` before each push. Do not stage modified `data/*.json` after test orders; those JSON files are shared demo fixtures.

## F. How to PULL other members' changes (on main)

If you don't have local uncommitted changes:

```powershell
git switch main
git pull --ff-only origin main
```

To bring fresh `main` into your feature branch:

```powershell
git switch jinming/module4-module5
git merge main
```

If Git says conflict, **don't delete or overwrite your teammate's code**. Open VS Code Source Control, inspect both changes and ask your group leader to help resolve the conflict.

## G. What was added?

### Module 5 (shopping cart)

1. `createCart.ts` — checks the restaurant and table QR (for dine-in), then starts a cart.
2. `getCart.ts` — fetches a cart after access checks.
3. `addCartItem.ts` — checks current item/availability/restaurant, and adds or increases a line.
4. `updateCartItem.ts` — updates quantity and special request. Invalid quantity is rejected.
5. `removeCartItem.ts` — removes one line.
6. `clearCart.ts` — clears all lines.
7. `previewCheckout.ts` — returns subtotal, discount, tax, delivery fee and total, using **server-side** catalog prices.

### Module 4 (orders)

1. `submitOrder.ts` — checks checkout, creates a Pending order and item snapshots. `checkoutRequestId` prevents duplicate orders.
2. `listMyOrders.ts` — customer history.
3. `listRestaurantOrders.ts` — owner's own restaurant queue only.
4. `getOrder.ts` — owner/customer/guest tracking (guest requires a secret request token).
5. `updateOrderStatus.ts` — Pending → Preparing → Ready only; no skipping.
6. `requestCancellation.ts` — customer asks while Pending.
7. `decideCancellation.ts` — owner approves/rejects, and demo refund if applicable.
8. `getTableInvoice.ts` — adds all non-cancelled orders under one open table visit.
9. `finishTableVisit.ts` — owner confirms counter payment; completes all Ready orders and closes visit, creates receipt, awards eligible points once.
10. `completeTakeawayOrder.ts` — completes a Ready pickup/delivery order and creates receipt.
11. `getReceipt.ts` — protected receipt read.
12. `archiveOrder.ts` — hides only completed/cancelled records without deleting history.

### Helpers (not a second service layer)

- `member-2/internal/rules.ts`: input checks and role/owner permissions.
- `member-2/internal/pricing.ts`: final cart calculations.
- `member-2/internal/completion.ts`: points and receipt functions called by Module 4 completion.
- `member-2/internal/serialize.ts`: simple single-process mutation queue for JSON demo.

## H. Understand the entire workflow in plain language

```text
Customer opens /cart
   ↓ createCart()
Customer presses Add food
   ↓ addCartItem() / updateCartItem()
Customer clicks Checkout
   ↓ previewCheckout() (server recalculates price)
Customer clicks Place order
   ↓ submitOrder() (Order + Order Items + demo Payment)
Owner opens Kitchen Queue
   ↓ listRestaurantOrders()
Owner clicks Prepare → Ready
   ↓ updateOrderStatus()
Pickup/Delivery: completeTakeawayOrder()
Dine-in: getTableInvoice() → finishTableVisit()
   ↓
Receipt and eligible points awarded once
```

Money is stored as integer `priceSen` so RM18.00 is `1800`, and for 2 items:
`1800 × 2 = 3600 sen = RM36.00`.

`ServiceResult<T>` always returns either:

```ts
{ ok: true, data: value }
// or
{ ok: false, error: { code: 'RULE', message: 'Explain problem' } }
```

The UI looks at `ok`. If false, it shows the error instead of falsely showing success.

## I. Unique feature: Real-Time Order Alert Engine

**JSON development stage:** `KitchenQueue.tsx` refreshes the order list every 4 seconds, flashes a banner for newly detected Pending orders and plays a Web Audio sound only after the owner clicks Enable sound. This is **polling, not Supabase Realtime**.

**Final feature:** `SUPABASE_REALTIME_LATER.md` includes the correct Supabase `postgres_changes` subscription plan and source code to adapt after the team activates Supabase + RLS. Do not copy the Supabase code into this JSON starter yet; it would violate the team's current checker.

## J. What still needs testing or team integration?

- These files are **local JSON demonstration code**, not a deployed commercial system.
- An offline service test passed 34 checks, but a full Next.js npm install/build/browser walkthrough could not be completed in the authoring environment due to package download timeout.
- JSON writes are independently atomic per file but **multi-file order/payment/loyalty transactions are NOT atomic**; use one Supabase PostgreSQL RPC transaction later.
- UI mockup and workflow are simplified within the existing TABLE & CO theme. Confirm final Figma layout with teammates.
- Real Supabase Realtime, Supabase Auth, RLS, vouchers and UAT need integration testing after the team migrates.
