# LIM JINMING — Module 4 + Module 5 (JSON demonstration)

## Which files are yours?
- `member-2/module-5-checkout/functions/` — seven cart + preview functions, one per file.
- `member-2/module-4-orders/functions/` — twelve order functions, one per file.
- `member-2/internal/` — validation, price calculation, completion helper and local write queue.
- `member-2/module-*/screens/` — customer and owner screens connected to the functions.

## Open in VS Code
Open the **inner** `Restaurant_System_JSON_Team_Starter` folder with `package.json`.
Use `npm.cmd ci` and then `npm.cmd run dev` in PowerShell (or regular `npm ci` in Command Prompt).
Open `http://localhost:3000/cart` and `http://localhost:3000/owner/orders`.

## Try the demo
1. Open `/cart`. Select "Jade Bowl Kitchen" and "Pickup". Click Start cart and Add to cart.
2. Continue to checkout. Fill contact name, phone, pickup time, choose simulated payment and Place order.
3. Copy order ID and use Track order. The long tracking token is required for guest orders.
4. In another browser/profile, sign in as owner: `sarah.owner@example.test` + `Demo12345`.
5. Open `/owner/orders`, select Jade Bowl Kitchen. Move Pending → Preparing → Ready → Completed.
6. For dine-in use token `demo-jade-table-001` when creating cart, and owner uses `/owner/invoices` → Finish/Paid.
7. Cancellation: customer requests while Pending; owner approves/rejects in Queue.

## Important boundaries
- This is a **local JSON development demo**, not a production checkout or real payment gateway.
- Owner notifications currently poll JSON every 4 seconds; the real Supabase Realtime feature is not wired yet.
- The JSON store serialises file writes separately. Multi-file operations like checkout, voucher refund and visit completion are NOT atomic. Migration to Supabase PostgreSQL needs a single transaction/RPC, constraints and RLS.
- Guest cart and guest order tokens are high-entropy references in the demo; production security needs hardened server sessions, token hashes and rate limiting.
- Owner authentication and Module 1/2/3/6 are owned by teammates. They must be tested together before the group submits.
