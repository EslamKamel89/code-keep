# Current feature

## Status

## Goals

## Notes

## history

- 2026-05-03: Dashboard UI Phase 1 started
- 2026-05-03: Dashboard UI Phase 1 completed — ShadCN initialized, dark mode set, /dashboard route with topbar + sidebar/main placeholders, build passing
- 2026-05-03: Dashboard UI Phase 2 started — collapsible sidebar with item types, favorite/recent collections, user avatar, mobile drawer
- 2026-05-03: Dashboard UI Phase 2 completed — collapsible sidebar with type links and counts, favorites/all collections, user avatar, mobile overlay drawer, responsive topbar, dark-only theme enforced via Tailwind v4
- 2026-05-06: Dashboard UI Phase 3 started — main content area with stats cards, recent collections, pinned items, and recent items using mock data
- 2026-05-06: Dashboard UI Phase 3 completed — stats cards, collections grid with type indicators, pinned items, recent items, DashboardShell pattern for server-component page.tsx, mobile responsiveness fixed
- 2026-05-06: Database implementation started — Prisma 7 + Neon PostgreSQL setup with full schema and initial migration
- 2026-05-06: Database implementation completed — Prisma 7 + Neon PostgreSQL, full schema migrated, 7 system ItemTypes seeded, PrismaNeon adapter configured, test script verified
- 2026-05-09: Seed data expansion started — demo user + full collections/items per seed-spec.md
- 2026-05-09: Seed data expansion completed — bcryptjs added, User.password field migrated, truncate-before-seed, demo user + 5 collections + 14 items seeded successfully