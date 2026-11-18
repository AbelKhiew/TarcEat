# Restaurant System — JSON Team Starter

Start with **START_HERE.md**. This is the reorganised development skeleton.

| Member | Folders |
| --- | --- |
| Member 1 | member-1/module-1-onboarding and member-1/module-3-tables |
| Member 2 | member-2/module-4-orders and member-2/module-5-checkout |
| Member 3 | member-3/module-2-catalog and member-3/module-6-loyalty |

- One business function per file in each module's functions/ folder.
- All sample application JSON data is in root data/.
- Shared JSON file read/create/update/delete helpers are WORKING.
- Business functions, authentication and module screens remain EMPTY.
- Homepage and style guide show the shared demo colours; this is not the finished UI.
- No Supabase connection, real payments or working login is included.

## VS Code

1. Extract the ZIP and open this root folder in VS Code.
2. Install Node.js 22 or newer.
3. Run `npm ci`.
4. Run `npm run dev` and open http://localhost:3000.
5. Visit /style-guide to see the required colour palette and shared CSS classes.

## Checks

- `npm run check`: structure/data-access rules and TypeScript.
- `npm run test:storage`: checks real JSON persistence using temporary data.
- `npm run build`: rule check and production build.

Rules run before dev/build. They catch accidental storage bypasses; they are not a security
sandbox. Team members must agree not to remove or bypass the checks.

Each developer has their own JSON files. Git combines CODE, not live application data.
Coordinate sample-data edits; do not overwrite another member's data silently.
