# CodeKeep — Full Engineering Specification (AI-Agent Optimized)

---

## 1. Core Problem

Developers store critical knowledge across fragmented systems:

- Code snippets in editors or note tools
- AI prompts inside chat sessions
- Context files inside repositories
- Links in bookmarks
- Commands in terminal history
- Templates in gists

This leads to:

- High context switching
- Loss of reusable knowledge
- Slower development cycles

**CodeKeep provides a unified, structured, and AI-enhanced knowledge system optimized for fast input and retrieval.**

---

## 2. Product Goals

### Primary Goals

- Ultra-fast capture of developer knowledge
- Powerful retrieval via search + filters
- Flexible organization (collections + tags)
- AI-assisted enrichment (optional)

### Secondary Goals

- Scalable data model
- Clean developer UX
- Extensible architecture for future features

---

## 3. System Architecture

### 3.1 High-Level Architecture

- Monorepo (Next.js fullstack)
- API layer inside `/app/api`
- Service layer abstraction (domain-based)
- Prisma ORM for DB access
- External services:
  - OpenAI (AI features)
  - Cloudflare R2 (file storage)
  - Stripe (billing)

---

## 4. Core Domain Design

---

## 4.1 Entities Overview

| Entity                 | Purpose                             |
| ---------------------- | ----------------------------------- |
| User                   | Auth + ownership                    |
| Account                | OAuth accounts                      |
| Session                | Auth sessions                       |
| VerificationToken      | Auth flows                          |
| Item                   | Core knowledge unit                 |
| ItemType               | Defines item behavior               |
| Collection             | Logical grouping                    |
| ItemCollection         | Many-to-many pivot                  |
| Tag                    | Labeling system                     |
| ItemTag                | Many-to-many pivot                  |
| UsageLog               | Track usage (future AI + analytics) |
| SearchIndex (optional) | Optimized search                    |
| Subscription           | Billing state                       |
| FileAsset              | File metadata abstraction           |

---

## 5. Database Schema (Prisma-Level Detail)

---

## 5.1 Auth Models (NextAuth Required)

```prisma
model User {
  id                    String   @id @default(cuid())
  name                  String?
  email                 String?  @unique
  emailVerified         DateTime?
  image                 String?

  isPro                 Boolean  @default(false)

  stripeCustomerId      String?  @unique
  stripeSubscriptionId  String?

  accounts              Account[]
  sessions              Session[]

  items                 Item[]
  collections           Collection[]
  itemTypes             ItemType[]

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}
```

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

---

## 5.2 Core Models

### Item

```prisma
model Item {
  id            String   @id @default(cuid())

  title         String
  description   String?

  contentType   ContentType
  content       String?
  url           String?

  language      String?

  isFavorite    Boolean @default(false)
  isPinned      Boolean @default(false)

  userId        String
  itemTypeId    String

  user          User      @relation(fields: [userId], references: [id])
  itemType      ItemType  @relation(fields: [itemTypeId], references: [id])

  collections   ItemCollection[]
  tags          ItemTag[]

  fileAsset     FileAsset?

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([userId])
  @@index([itemTypeId])
  @@index([title])
}
```

---

### ItemType

```prisma
model ItemType {
  id        String   @id @default(cuid())
  name      String
  icon      String
  color     String

  isSystem  Boolean  @default(false)

  userId    String?

  user      User? @relation(fields: [userId], references: [id])

  items     Item[]

  @@unique([name, userId])
}
```

---

### Collection

```prisma
model Collection {
  id            String   @id @default(cuid())

  name          String
  description   String?

  isFavorite    Boolean  @default(false)

  defaultTypeId String?

  userId        String
  user          User     @relation(fields: [userId], references: [id])

  items         ItemCollection[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([userId])
}
```

---

### ItemCollection (Pivot)

```prisma
model ItemCollection {
  itemId       String
  collectionId String

  addedAt      DateTime @default(now())

  item         Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
}
```

---

### Tag

```prisma
model Tag {
  id      String @id @default(cuid())
  name    String

  userId  String
  user    User @relation(fields: [userId], references: [id])

  items   ItemTag[]

  @@unique([name, userId])
}
```

---

### ItemTag (Pivot)

```prisma
model ItemTag {
  itemId String
  tagId  String

  item   Item @relation(fields: [itemId], references: [id], onDelete: Cascade)
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([itemId, tagId])
}
```

---

### FileAsset

```prisma
model FileAsset {
  id        String @id @default(cuid())

  url       String
  fileName  String
  fileSize  Int
  mimeType  String

  itemId    String @unique
  item      Item   @relation(fields: [itemId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
}
```

---

### Subscription

```prisma
model Subscription {
  id        String @id @default(cuid())

  userId    String @unique
  user      User   @relation(fields: [userId], references: [id])

  status    String
  plan      String

  currentPeriodEnd DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

### UsageLog (Future AI + Analytics)

```prisma
model UsageLog {
  id        String @id @default(cuid())

  userId    String
  action    String
  metadata  Json?

  createdAt DateTime @default(now())

  @@index([userId])
}
```

---

## 6. Enums

```prisma
enum ContentType {
  TEXT
  FILE
  LINK
}
```

---

## 7. API Design (Agent-Oriented)

### Item APIs

```
POST   /api/items
GET    /api/items
GET    /api/items/:id
PATCH  /api/items/:id
DELETE /api/items/:id
```

### Collection APIs

```
POST   /api/collections
GET    /api/collections
PATCH  /api/collections/:id
DELETE /api/collections/:id
```

### Tag APIs

```
POST   /api/tags
GET    /api/tags
```

### Search API

```
GET /api/search?q=&type=&tag=&collection=
```

---

## 8. AI System Design

### AI Capabilities

- Tag generation
- Summarization
- Code explanation
- Prompt optimization

### AI Service Layer

```
/services/ai/
  - generateTags()
  - summarize()
  - explainCode()
  - optimizePrompt()
```

### Constraints

- Only available for Pro users
- Rate limiting required
- Log usage in `UsageLog`

---

## 9. Search System

### Phase 1

- SQL-based search (`ILIKE`)
- Indexed columns:
  - title
  - content

### Phase 2 (Optional)

- Full-text search
- Dedicated search index table

---

## 10. File Handling

### Upload Flow

1. Client requests signed URL
2. Upload to Cloudflare R2
3. Store metadata in `FileAsset`

### Constraints

- Only Pro users
- File size limits enforced

---

## 11. Permissions & Access Control

### Rules

- All data is user-scoped
- No cross-user access
- Middleware must enforce:
  - Authenticated user
  - Ownership checks

---

## 12. Monetization Enforcement

### Free Tier Limits

- Max 50 items
- Max 3 collections

### Enforcement Points

- API layer validation
- Middleware guard

---

## 13. UI Behavior Contracts (Important for Agents)

### Item Creation

- Must support quick-create (drawer)
- Minimal required fields:
  - title
  - type

### Item Editing

- Inline editing preferred
- Autosave (future)

### Navigation

- `/items/{type}`
- `/collections/{id}`

---

## 14. Performance Considerations

- Use pagination on all list endpoints
- Use indexes on:
  - userId
  - title
  - createdAt

- Lazy load heavy content
- Cache frequently accessed items (optional Redis)

---

## 15. Development Rules

- Use Prisma migrations only (no db push)
- Strict typing across all layers
- Service layer must isolate business logic
- No direct DB access in API routes

---

## 16. Seed Data (Required)

System Item Types:

```json
[
  { "name": "snippet", "icon": "Code", "color": "#3b82f6", "isSystem": true },
  {
    "name": "prompt",
    "icon": "Sparkles",
    "color": "#8b5cf6",
    "isSystem": true
  },
  {
    "name": "command",
    "icon": "Terminal",
    "color": "#f97316",
    "isSystem": true
  },
  {
    "name": "note",
    "icon": "StickyNote",
    "color": "#fde047",
    "isSystem": true
  },
  { "name": "file", "icon": "File", "color": "#6b7280", "isSystem": true },
  { "name": "image", "icon": "Image", "color": "#ec4899", "isSystem": true },
  { "name": "link", "icon": "Link", "color": "#10b981", "isSystem": true }
]
```

---

## 17. Summary

CodeKeep is a structured developer knowledge system built around:

- A flexible relational model (items, collections, tags)
- Strong ownership and access control
- AI-augmented workflows
- Scalable architecture with Prisma and Next.js

This specification ensures that an AI coding agent can:

- Understand domain boundaries
- Generate correct database schema
- Implement APIs consistently
- Enforce business rules
- Extend the system safely
