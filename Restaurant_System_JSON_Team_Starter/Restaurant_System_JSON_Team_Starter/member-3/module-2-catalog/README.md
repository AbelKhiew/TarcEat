# Module 2: Menu Catalog & Asset Management

Owner: Member 3.

- `functions/`: one business function per file. EMPTY bodies, ready to implement.
- `screens/`: blank React UI placeholders. Apply shared theme classes.
- `contract.ts`: final function inputs and result types. Keep these stable.
- `index.ts`: import shortcut. No business logic here.

Read root START_HERE.md and docs/MEMBER_RULES.md first.
UI imports a function; the function runs on the local server and calls shared/storage.
The shared JSON store is already implemented. Do not add another mock or service layer.
Replace StubResult with Promise<ServiceResult<T>> as each function is completed.

## Functions

- [ ] `listCategories.ts` → `T.Category[]`
- [ ] `createCategory.ts` → `T.Category`
- [ ] `updateCategory.ts` → `T.Category`
- [ ] `deleteCategory.ts` → `null`
- [ ] `listMenuItems.ts` → `T.MenuItem[]`
- [ ] `createMenuItem.ts` → `T.MenuItem`
- [ ] `updateMenuItem.ts` → `T.MenuItem`
- [ ] `archiveMenuItem.ts` → `T.MenuItem`
- [ ] `setItemAvailability.ts` → `T.MenuItem`
- [ ] `previewMenuImage.ts` → `string`

## Theme

Use `page`, `panel`, `button`, `button-secondary`, `field`, `notice`, `badge` and
`data-table` classes. Use variables from styles/theme.css, not hardcoded colours.

## Handover

Member name: 
Finished functions:
Finished screens:
Known gaps:
Requested shared contract changes:
