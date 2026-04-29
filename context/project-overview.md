# CodeKeep — Authoritative Product & Engineering Specification

---

## 1. Product Definition

CodeKeep is a developer-centric knowledge management system that unifies:

- Code snippets
- AI prompts
- Notes
- Commands
- Links
- Files & images

into a single, fast, searchable, and structured workspace.

The system is designed to minimize context switching, preserve reusable knowledge, and enable rapid retrieval.

---

## 2. Core Principles

- **Speed-first UX** (capture and retrieval must be instant)
- **Context preservation** (no full-page navigation for core actions)
- **Flexible organization** (collections are not type-restricted)
- **AI-augmented, not AI-dependent**
- **Strong ownership & isolation per user**

---

## 3. Core Concepts

### 3.1 Item

The atomic unit of knowledge.

An item can represent:

- Code snippet
- Prompt
- Note
- Command
- Link
- File
- Image

---

### 3.2 Item Type

Defines behavior, color, and icon.

#### System Types (immutable)

| Type    | Color   | Icon       |
| ------- | ------- | ---------- |
| snippet | #3b82f6 | Code       |
| prompt  | #8b5cf6 | Sparkles   |
| command | #f97316 | Terminal   |
| note    | #fde047 | StickyNote |
| file    | #6b7280 | File       |
| image   | #ec4899 | Image      |
| link    | #10b981 | Link       |

---

### 3.3 Collection

A flexible container of items.

**Important Rule:**

- A collection can contain **multiple item types simultaneously**

---

### 3.4 Tag

A lightweight labeling system used for filtering and organization.

---

### 3.5 Relationships

- Item ↔ Collection → many-to-many
- Item ↔ Tag → many-to-many
- Item → ItemType → many-to-one

---

## 4. Database Schema (Prisma)

### 4.1 Auth Models (NextAuth)

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

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

---

### 4.2 Core Models

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
}

model ItemCollection {
  itemId       String
  collectionId String

  addedAt      DateTime @default(now())

  item         Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
}

model Tag {
  id      String @id @default(cuid())
  name    String

  userId  String
  user    User @relation(fields: [userId], references: [id])

  items   ItemTag[]

  @@unique([name, userId])
}

model ItemTag {
  itemId String
  tagId  String

  item   Item @relation(fields: [itemId], references: [id], onDelete: Cascade)
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([itemId, tagId])
}

model FileAsset {
  id        String @id @default(cuid())

  url       String
  fileName  String
  fileSize  Int
  mimeType  String

  itemId    String @unique
  item      Item   @relation(fields: [itemId], references: [id], onDelete: Cascade)
}

model Subscription {
  id        String @id @default(cuid())

  userId    String @unique
  user      User   @relation(fields: [userId], references: [id])

  status    String
  plan      String

  currentPeriodEnd DateTime?
}
```

---

### 4.3 Enums

```prisma
enum ContentType {
  TEXT
  FILE
  LINK
}
```

---

## 5. UI Architecture

### 5.1 Layout

- Sidebar (navigation + filters)
- Topbar (search + actions)
- Main content:
  - Collections grid
  - Pinned items
  - Items list/grid

- Drawer (item view/edit)

---

### 5.2 Core UI Sections

#### Sidebar

- Item types (with counts)
- Favorite collections
- All collections
- User profile

---

#### Topbar

- Global search
- Quick actions:
  - New Collection
  - New Item

- Command hint (⌘K)

---

#### Collections Grid

Each card includes:

- Name
- Description
- Item count
- Favorite state
- Type indicators (multi-type)
- Context menu

---

#### Pinned Section

- Displays all pinned items globally
- Not tied to a single collection

---

#### Items View

Each item shows:

- Title
- Description
- Tags
- Type
- Date
- Favorite / Pin state

---

#### Drawer (Critical Component)

Used for:

- Viewing
- Editing
- Managing items

Includes:

- Title
- Type badge
- Language badge
- Actions:
  - Favorite
  - Pin
  - Copy
  - Edit
  - Delete

- Content (code/text/link)
- Tags
- Collections
- Metadata (createdAt, updatedAt)

---

## 6. Features

### 6.1 Item Features

- Create / edit / delete
- Multi-collection assignment
- Tagging
- Favorite & pin
- Markdown support
- File upload (Pro)

---

### 6.2 Collection Features

- Create / edit / delete
- Favorite collections
- Multi-type support

---

### 6.3 Search & Filtering

- Search by title/content
- Filter by:
  - Type
  - Tag
  - Collection
  - Favorites

---

### 6.4 AI Features (Pro)

- Auto-tagging
- Summarization
- Code explanation
- Prompt optimization

---

### 6.5 Additional Features

- Recently used items
- Export (JSON/ZIP)
- Syntax highlighting
- Dark mode

---

## 7. API Design

### Items

```
POST   /api/items
GET    /api/items
GET    /api/items/:id
PATCH  /api/items/:id
DELETE /api/items/:id
```

### Collections

```
POST   /api/collections
GET    /api/collections
PATCH  /api/collections/:id
DELETE /api/collections/:id
```

### Tags

```
POST   /api/tags
GET    /api/tags
```

### Search

```
GET /api/search?q=&type=&tag=&collection=
```

---

## 8. System Behavior Rules

- All data is user-scoped
- No cross-user access
- Drawer is primary interaction surface
- No page navigation for item viewing
- Collections must support mixed item types
- Pinned items are global
- Favorites affect sidebar visibility

---

## 9. Monetization

### Free

- 50 items
- 3 collections
- No files/images
- No AI

### Pro

- Unlimited items
- Unlimited collections
- File/image uploads
- AI features
- Export
- Priority support

---

## 10. Performance Requirements

- Indexed queries (userId, title)
- Pagination on list endpoints
- Lazy loading for content
- Optional Redis caching

---

## 11. Development Constraints

- Prisma migrations only (no db push)
- Service-layer architecture required
- Strict TypeScript usage
- No direct DB access in controllers

---

## 12. Seed Data

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

## 13. UI Design (Authoritative Reference)

The UI implementation **must strictly follow the provided visual mockups**, which serve as the single source of truth for layout, spacing, hierarchy, and interaction patterns.

### 13.1 Design References

The following screenshots define the dashboard experience:

- `@context/screenshots/dashboard-ui-main.png` → **Main Dashboard Layout**
- `@context/screenshots/dashboard-ui-drawer.png` → **Item Drawer (Detail View)**

These are not optional references — they are **authoritative design specifications**.

---

### 13.2 Scope of Responsibility

The screenshots define:

- Layout structure (sidebar, topbar, content, drawer)
- Component hierarchy
- Spacing, alignment, and proportions
- Visual states (hover, active, selected)
- Color usage and emphasis
- Information density and grouping
- Interaction patterns (especially drawer behavior)

---

### 13.3 Main Dashboard Requirements

From `dashboard-ui-main.png`, the implementation must include:

#### Layout

- Persistent left sidebar
- Top navigation bar with search and actions
- Main scrollable content area

#### Sidebar

- Item types with counts
- Collections grouped into:
  - Favorites
  - All Collections

- Active/selected states
- User profile section at bottom

#### Topbar

- Search input with shortcut hint (⌘K style)
- Action buttons:
  - New Collection
  - New Item

#### Collections Section

- Responsive grid layout
- Each collection card must include:
  - Title
  - Item count
  - Description
  - Favorite indicator (if applicable)
  - Type indicators (multiple types allowed)
  - Context menu (⋯)

- Border color reflects dominant type (based on item types inside)

#### Pinned Section (Required)

- Separate section below collections
- Displays pinned items globally
- Not scoped to a single collection

#### Item Cards

- Must display:
  - Title
  - Description
  - Tags
  - Type indicator
  - Date (optional but visible in design)

- Visual emphasis on hover

---

### 13.4 Drawer Requirements

From `dashboard-ui-drawer.png`, the implementation must include:

#### Behavior

- Slides from the right
- Does NOT navigate away from dashboard
- Overlay with backdrop
- Supports click outside to close

#### Header

- Item title
- Type badge
- Language badge (if applicable)
- Action buttons:
  - Favorite
  - Pin
  - Copy
  - Edit
  - Delete

#### Content Sections

Must be structured exactly as:

1. Description
2. Content (code/text/link)
   - Syntax highlighting for code

3. Tags (as chips)
4. Collections (multi-collection membership)
5. Metadata:
   - Created date
   - Updated date

---

### 13.5 Critical UI Rules

- **Drawer-first interaction model**
  → Items are never opened via full page navigation

- **Collections support mixed item types**
  → UI must visually reflect multiple types per collection

- **Color system must match item types**
  → Colors defined in spec must be used consistently

- **High information density without clutter**
  → Follow spacing and grouping from screenshots precisely

- **Dark mode is default**
  → Light mode is optional and not required for initial implementation

---

### 13.6 Responsiveness

- Desktop-first design (primary target)
- Tablet: reduced grid columns
- Mobile:
  - Sidebar becomes drawer
  - Drawer becomes full-screen

---

### 13.7 Implementation Constraint

If any ambiguity exists between:

- Written spec
- UI screenshots

👉 **The screenshots take priority for UI behavior and structure.**

---

### 13.8 Summary

The two screenshots collectively define:

- The **complete dashboard experience**
- The **core interaction model (drawer-based)**
- The **visual system and hierarchy**

They must be treated as **pixel-accurate references**, not inspiration.

---

## 14. Final Summary

CodeKeep is a **context-preserving developer system** built on:

- Flexible relational data modeling
- Drawer-first UX
- Multi-type collections
- Fast search and retrieval
- AI-augmented workflows

This specification is the **single source of truth** for implementation across backend, frontend, and AI agents.
