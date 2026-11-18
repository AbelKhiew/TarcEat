# Team rules

1. Code only in your assigned member/module folders unless the team agrees otherwise.
2. One exported business function per file. Filename matches function name.
3. Screens call public server function files. Server function files call the shared store.
4. No direct JSON imports or filesystem access in member code.
5. No localStorage, sessionStorage, IndexedDB or Supabase during this development phase.
6. Keep shared models, IDs, money-in-sen format and final contracts consistent.
7. Do not create duplicate service/mock layers; the function file IS the public service boundary.
8. Use fixed shared palette/classes, not literal colours in module code.
9. Do not delete rule checks. Run npm run check before handing over work.
10. This enforces an agreed workflow through checks, not through unbreakable permissions.

An implemented function normally imports store directly. For legitimate operations that only
coordinate other server functions, ask the lead to review a narrow exception in check-rules.mjs.
Do not add meaningless imports just to satisfy the check.

Shared files are team-lead owned: shared/, styles/, data schema, package files and rule checker.
Only initial fixtures should be coordinated through Git. Local runtime changes are not shared
live between computers. Review data/*.json before committing; never add private customer data.
