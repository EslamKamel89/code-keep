# Current feature

## Status

In Progress

## Goals

- Install Prisma 7 and `@prisma/client`; configure for Neon PostgreSQL (serverless driver)
- Create `prisma/schema.prisma` with all models from project-overview.md:
  - Auth models: `User`, `Account`, `Session`, `VerificationToken`
  - Core models: `Item`, `ItemType`, `Collection`, `ItemCollection`, `Tag`, `ItemTag`, `FileAsset`, `Subscription`
  - Enum: `ContentType`
- Add all indexes (`@@index`) and cascade deletes as specified in schema
- Run `prisma migrate dev --name init` to generate the initial migration
- Seed system `ItemType` records (snippet, prompt, command, note, file, image, link)

## Notes

- Prisma 7 has breaking changes — read the full upgrade guide before writing any code
- `DATABASE_URL` points to the Neon **development** branch; production branch is separate
- Always use `prisma migrate dev` (never `db push`) per project coding standards
- Use `prisma migrate deploy` in production before app starts

## history

- 2026-05-03: Dashboard UI Phase 1 started
- 2026-05-03: Dashboard UI Phase 1 completed — ShadCN initialized, dark mode set, /dashboard route with topbar + sidebar/main placeholders, build passing
- 2026-05-03: Dashboard UI Phase 2 started — collapsible sidebar with item types, favorite/recent collections, user avatar, mobile drawer
- 2026-05-03: Dashboard UI Phase 2 completed — collapsible sidebar with type links and counts, favorites/all collections, user avatar, mobile overlay drawer, responsive topbar, dark-only theme enforced via Tailwind v4
- 2026-05-06: Dashboard UI Phase 3 started — main content area with stats cards, recent collections, pinned items, and recent items using mock data
- 2026-05-06: Dashboard UI Phase 3 completed — stats cards, collections grid with type indicators, pinned items, recent items, DashboardShell pattern for server-component page.tsx, mobile responsiveness fixed
- 2026-05-06: Database implementation started — Prisma 7 + Neon PostgreSQL setup with full schema and initial migration
