# Current feature

## Status

Completed

## Goals

- Display stats (total items, collections, item types, tags) from the database instead of mock data
- Display system item types in the sidebar with their icons, each linking to `/items/[typename]`
- Add a "View all collections" link under the collections list in the sidebar pointing to `/collections`
- Favorite collections keep their star icons; recent collections show a colored circle based on the most-used item type in that collection
- Add any missing DB query functions to `src/lib/db/items.ts` (using `src/lib/db/collections.ts` as reference)

## Notes

- Spec file: `context/features/stats-sidebar-spec.md`
- Item types are seeded system types; use their `color` field for the colored circles in recent collections
- Keep existing design/layout — data source changes only, no UI redesign

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
- 2026-05-09: Dashboard collections real data started — replace mock collections with Prisma DB queries, border color from dominant type, type icons per collection
- 2026-05-09: Dashboard collections real data completed — src/lib/db/collections.ts created, CollectionsGrid made async server component, CollectionCard updated with dominant-type border color and live type icons, build passing
- 2026-05-13: Dashboard items real data started — replace mock pinned/recent items with Prisma DB queries, item card icon/border from item type, update collection stats
- 2026-05-13: Dashboard items real data completed — src/lib/db/items.ts created, PinnedItems/RecentItems/StatsCards made async server components, ItemCard updated to use live itemType relation and DB tags, mock data removed from all item components, build passing
- 2026-05-13: Stats & sidebar real data started — replace mock stats with DB queries, sidebar item types from DB with icon links, colored circles for recent collections based on dominant type, "View all collections" link
- 2026-05-13: Stats & sidebar real data completed — src/lib/db/sidebar.ts created, getSidebarItemTypes/getSidebarCollections added, Sidebar migrated from mock data to DB props via DashboardShell, colored dots for all collections, "View all collections" link, build passing