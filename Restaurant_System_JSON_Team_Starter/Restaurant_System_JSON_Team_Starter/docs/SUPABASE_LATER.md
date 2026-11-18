# Your later integration work

## Stable boundaries

Screen → member/module/functions/name.ts → shared/storage → JSON files.
Later: same screen → same public function → backend/shared storage → Supabase.

For simple typed list/get/create/update/remove operations, provide a Supabase-backed DataStore
and change shared/storage/index.ts. Keep money units, return shapes and error handling stable.
Do not fetch a whole table to emulate every JSON operation. Translate filter objects into queries.
Mapping camelCase application fields to database column names belongs inside the adapter.

## Work beyond an adapter swap

- Replace development profile selection with real authentication and server authorization.
- Add row access policies and restaurant/customer isolation.
- Keep contact data private and implement guest tracking tokens.
- Replace local images with uploaded image paths when needed.
- Implement order submission and Finish / Paid as database transactions or controlled SQL RPCs.
- Add unique constraints: checkout request, one open visit/table, points once/order, one receipt/visit.
- Review archive and retention rules instead of hard-deleting history.

JSON helpers replace one collection file atomically and queue writes in one Node.js process.
They are NOT multi-file or distributed transactions. Do not describe the complete order/payment
workflow as atomic until its coordinator is implemented and verified. Local files do not support
a shared hosted production database. Use them only while developing locally.

Your JSON data does not transfer automatically. Import reviewed seed data separately if wanted.
Readable sample IDs may need mapping to UUIDs, especially Supabase Auth profile IDs.
