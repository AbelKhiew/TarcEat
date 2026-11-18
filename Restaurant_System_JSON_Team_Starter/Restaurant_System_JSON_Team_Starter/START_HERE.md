# Start here — simple team instructions

## What changed

Each member has a clearly named folder containing their two modules.
Every business function is one file. The old combined service/mock files are gone.
Read/create/update/delete code lives in shared/storage. All runtime JSON collections
live in data/ at the root, outside public/.

## How to build a feature

1. Open your module README and contract.ts.
2. Open the matching functions/functionName.ts file.
3. Validate the user role, restaurant ownership and form input.
4. Use `store.list`, `store.get`, `store.create`, `store.update` or `store.remove`.
5. Return the same ServiceResult shape agreed in contract.ts.
6. Replace StubResult with Promise<ServiceResult<T>> when the function is implemented.
7. Build its screen in screens/. Import the public function, not the storage helper.
8. Use shared theme classes from styles/theme.css.
9. Run npm run check and demonstrate the feature before merging.

## Example data access (reference only)

In a SERVER business function:

```ts
import { store } from '@/shared/storage';

const items = await store.list('menuItems', { restaurantId });
const item = await store.get('menuItems', itemId);
await store.create('menuItems', newItem);
await store.update('menuItems', itemId, { priceSen: 1800 });
await store.remove('menuItems', itemId);
```

These are real local JSON operations, not browser localStorage.
Use domain archive functions instead of removing records needed by old orders.
The store validates collection names and serializes individual writes in one server process.
It does NOT implement business validation, restaurant permissions, foreign keys or transactions
across several files. Those responsibilities belong to the module function/coordinator.

## A screen calls its server function

Import the appropriate functions/name.ts. The `use server` directive keeps file access
on the local Next.js server. Screens must not import node:fs or the JSON files.
Each member codes and tests locally; this development store is not for deployment.

## Before the team starts

The lead should implement shared/auth functions or agree on a clearly marked demo-session
selector. Keep each person's selection in their own session/cookie, not one global current-user
JSON record. Never write real passwords into data/profiles.json.

The module functions are intentionally empty. Until implemented, awaiting them gives undefined.
Do not show a success message when a stub returns undefined.

## Simple example to try first

Member 3: implement listMenuItems, then build MenuItemList.
Next implement createMenuItem, updateMenuItem and archiveMenuItem with the JSON store.
Members 1 and 2 can then call those public functions using the shared data IDs.

## Later: Supabase

Keep screens and module function signatures stable. Replace the store adapter for ordinary CRUD.
Authentication, image uploads and connected workflows still need backend work. Order submission,
voucher redemption and Finish / Paid need database transactions, not separate CRUD substitutions.
See docs/SUPABASE_LATER.md.
