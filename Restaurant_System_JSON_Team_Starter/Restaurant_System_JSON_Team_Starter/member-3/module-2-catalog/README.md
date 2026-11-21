Owner: Member 3.

- `functions/`: one business function per file. Server Actions for this module.
- `screens/`: React screens for the existing routes. Apply shared theme classes.
- `contract.ts`: final function inputs and result types. Keep these stable.
- `index.ts`: import shortcut. No business logic here.


## Functions

- [x] `listCategories.ts` → `T.Category[]`
- [x] `createCategory.ts` → `T.Category`
- [x] `updateCategory.ts` → `T.Category`
- [x] `deleteCategory.ts` → `null`
- [x] `listMenuItems.ts` → `T.MenuItem[]`
- [x] `createMenuItem.ts` → `T.MenuItem`
- [x] `updateMenuItem.ts` → `T.MenuItem`
- [x] `archiveMenuItem.ts` → `T.MenuItem`
- [x] `setItemAvailability.ts` → `T.MenuItem`
- [x] `previewMenuImage.ts` → `string`

## Theme

## Handover

Member name: LOOI WEI XIANG
Finished functions: all public catalog functions above.
Finished screens: owner menu and categories, public menu, image preview.
Known gaps: the public menu reads the restaurant ID from /menu?restaurant=restaurant-001. QR entry and Add to Cart require integration with the team routes. Local image files are preview-only.

Requested shared contract changes: