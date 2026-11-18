# Confirmed system rules

1. Owners register themselves. Root Admin approves restaurants, not account registration.
2. Approval links a restaurant to the applicant's existing owner account.
3. One owner may manage multiple approved restaurants and switch context.
4. Suspension or closed status blocks new orders; existing orders may still finish.
5. Tables can be created individually or in batches.
6. Scanning only validates context and offers login/guest. The first successful order
   opens a visit; later orders join it. One open visit per table.
7. Customers at a table see the whole current table bill, excluding private contacts.
8. The whole table pays together. Owner checks payment, then uses one Finish / Paid.
9. Completion creates one receipt with Print or Done. Retry returns the same receipt.
10. Pickup/delivery use clearly labelled simulated payment; no real gateway or verification.
11. A customer can request cancellation while Pending. Owner approves/rejects it.
    Resolve outstanding requests before preparing. Approved simulated-paid cancellation
    records simulated refund and reverses recorded voucher usage.
12. All voucher use requires a registered customer. One voucher per order.
13. Owner controls restaurant voucher limits. Platform vouchers apply everywhere.
14. Withdrawing a platform offer stops new claims. Existing claims remain usable unless
    Root Admin disables usability. One or multiple uses are configurable.
15. Points: one per whole RM1 after merchandise discount, excluding tax/delivery;
    award once per completed order to its placing customer. No guest/cancelled points.
16. Catalog edits never rewrite historical item or invoice snapshots.
17. Ready is required for remaining dine-in orders before Finish / Paid.
18. Requested pickup time is captured; no separate owner acceptance stage in this scope.
19. Loyalty tiers are optional and excluded from this base scaffold.

## Integration coordinators

Module 4 alone creates submitted orders. Module 5 prepares checkout.
Module 3 owns visits; its internal helpers operate on the coordinator's coordinated working snapshot.
Module 6 owns points and voucher rules; its internal helpers participate in that same snapshot.
Never persist each helper independently inside a multi-module operation.

The cross-module coordinators are not implemented. Shared JSON storage does not make
multiple file changes atomic; the lead must coordinate and test these workflows.
