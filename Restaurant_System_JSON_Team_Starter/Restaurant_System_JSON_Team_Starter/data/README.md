# All application JSON data

One named collection per JSON file. The Next.js server reads and writes these files
through shared/storage. Do not move this folder inside public/ or import data in screens.
The package.json, tsconfig.json and other setup JSON files outside this folder are configuration,
not application data.

- profiles.json: fictional accounts, no passwords.
- restaurants.json: owner-001 owns restaurant-001 AND restaurant-002.
- restaurantApplications.json: pending application-001 belongs to owner-001.
- categories.json / menuItems.json: restaurant menu data.
- tables.json / visits.json: table-001 available; table-002 has open visit-001.
- carts.json: customer-001 sample dine-in cart.
- orders.json / orderItems.json: Ready dine-in, Pending pickup cancellation and Completed pickup.
- vouchers.json / customerVouchers.json / voucherRedemptions.json: voucher rules, claims and uses.
- loyaltyAccounts.json / loyaltyTransactions.json: customer-001 has 1,200 points.
- paymentRecords.json / receipts.json: simulated payment and completed receipt example.
- devSessions.json: example contexts only. Do not use it as a global active-user record.

Runtime edits persist here on YOUR computer. Refreshing does not reset data. The test-storage
command copies these files to a temporary directory; it does not change the original fixtures.
For a clean reset, extract the original ZIP to a separate folder and restore reviewed data files.
Keep backups before replacing local working data. Never save real passwords or personal data.
