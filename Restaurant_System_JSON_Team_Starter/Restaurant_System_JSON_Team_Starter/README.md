# Table & Co — Modules 1 and 3

Open this folder in VS Code. With Node.js 22 or newer, run:

```sh
npm ci
npm run dev
```

Open http://localhost:3000/login. The development accounts use password
`Demo12345`. Use `sarah.owner@example.test` in the Restaurant owner form and
`admin@example.test` in the Root Admin form. A newly registered owner uses
the password entered at registration. Development sessions reset after a
server restart. Seed credentials work only in development.

Module 1 covers owner registration, restaurant applications, Root Admin
approval or rejection, restaurant selection, profile updates, platform status
and public restaurant search. Newly approved restaurants start closed so the
owner can review their profile and decide when to begin accepting orders.

Module 3 covers individual and batch table creation, table renumbering,
unused-table deletion, per-table QR codes, QR replacement, and table lookup.
The standard tables page shows Available or Occupied. Scanning a QR code
does not create a visit. Module 4 can use Module 3's internal helpers on its
working snapshot to open or close visits as part of order submission and
payment completion.

For a phone scan, run the server on your local network and set
`RESTAURANT_QR_ORIGIN` in `.env.local` to the computer's reachable URL
before generating the QR codes. The default localhost link is for the
same computer.

Business functions are under `member-1/`, one public function per file.
They use the same shared JSON store as the starter. Owner password hashes
are stored in the private local profiles file. Use test credentials and
keep local account changes out of shared fixture commits.

Modules 2, 4, 5 and 6 are still the team starter placeholders, so customer
menu, checkout, order completion and loyalty are pending team integration.
The optional floorplan and batch QR print layout are outside this delivery.

`npm run check`, `npm run test:storage` and `npm run build` validate the project.
