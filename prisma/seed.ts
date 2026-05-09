import "dotenv/config"
import bcrypt from "bcryptjs"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const systemTypes = [
  { name: "snippet", icon: "Code",       color: "#3b82f6" },
  { name: "prompt",  icon: "Sparkles",   color: "#8b5cf6" },
  { name: "command", icon: "Terminal",   color: "#f97316" },
  { name: "note",    icon: "StickyNote", color: "#fde047" },
  { name: "file",    icon: "File",       color: "#6b7280" },
  { name: "image",   icon: "Image",      color: "#ec4899" },
  { name: "link",    icon: "Link",       color: "#10b981" },
]

async function truncate() {
  // Delete leaf/junction tables first, then parents
  await prisma.fileAsset.deleteMany()
  await prisma.itemTag.deleteMany()
  await prisma.itemCollection.deleteMany()
  await prisma.item.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.collection.deleteMany()
  await prisma.itemType.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()
  console.log("Database truncated")
}

async function main() {
  await truncate()

  // System item types
  await prisma.itemType.createMany({
    data: systemTypes.map((t) => ({ ...t, isSystem: true })),
  })
  console.log("Seeded 7 system item types")

  // Demo user
  const passwordHash = await bcrypt.hash("12345678", 12)
  const user = await prisma.user.create({
    data: {
      email: "demo@devstash.io",
      name: "Demo User",
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  })
  console.log("Seeded demo user:", user.email)

  // Fetch type IDs
  const types = await prisma.itemType.findMany({ where: { isSystem: true } })
  const typeId = (name: string) => {
    const t = types.find((t) => t.name === name)
    if (!t) throw new Error(`ItemType "${name}" not found`)
    return t.id
  }

  // ── React Patterns ────────────────────────────────────────────────────────
  const reactPatterns = await prisma.collection.create({
    data: {
      name: "React Patterns",
      description: "Reusable React patterns and hooks",
      userId: user.id,
    },
  })

  const reactItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "useDebounce & useLocalStorage hooks",
        description: "Commonly used custom hooks for debouncing values and syncing state with localStorage",
        contentType: "TEXT",
        language: "typescript",
        content: `import { useState, useEffect } from "react"

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initial
    } catch {
      return initial
    }
  })
  const setValue = (value: T) => {
    setStored(value)
    window.localStorage.setItem(key, JSON.stringify(value))
  }
  return [stored, setValue] as const
}`,
        userId: user.id,
        itemTypeId: typeId("snippet"),
      },
    }),
    prisma.item.create({
      data: {
        title: "Context provider + compound component pattern",
        description: "Type-safe React context with a compound component example",
        contentType: "TEXT",
        language: "typescript",
        content: `import { createContext, useContext, useState } from "react"

interface ThemeCtx { theme: "light" | "dark"; toggle: () => void }
const ThemeContext = createContext<ThemeCtx | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme(t => t === "dark" ? "light" : "dark") }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider")
  return ctx
}`,
        userId: user.id,
        itemTypeId: typeId("snippet"),
      },
    }),
    prisma.item.create({
      data: {
        title: "Utility functions (cn, formatDate, truncate)",
        description: "Lightweight utility helpers used across the app",
        contentType: "TEXT",
        language: "typescript",
        content: `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(date))
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + "…" : str
}`,
        userId: user.id,
        itemTypeId: typeId("snippet"),
      },
    }),
  ])

  await prisma.itemCollection.createMany({
    data: reactItems.map((item) => ({ itemId: item.id, collectionId: reactPatterns.id })),
  })
  console.log("Seeded React Patterns (3 snippets)")

  // ── AI Workflows ──────────────────────────────────────────────────────────
  const aiWorkflows = await prisma.collection.create({
    data: {
      name: "AI Workflows",
      description: "AI prompts and workflow automations",
      userId: user.id,
    },
  })

  const aiItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Code review prompt",
        description: "Structured prompt for a thorough AI-assisted code review",
        contentType: "TEXT",
        content: `Review the following code and provide feedback on:
1. Potential bugs or logic errors
2. Performance bottlenecks
3. Security vulnerabilities (injection, auth, exposure)
4. Code readability and naming clarity
5. Adherence to SOLID principles

For each issue: include severity (low/medium/high), the affected line(s), and a concrete fix.

\`\`\`
[paste code here]
\`\`\``,
        userId: user.id,
        itemTypeId: typeId("prompt"),
      },
    }),
    prisma.item.create({
      data: {
        title: "Documentation generation prompt",
        description: "Generate complete TSDoc for any function",
        contentType: "TEXT",
        content: `Generate comprehensive TSDoc documentation for the function below. Include:
- A one-sentence summary
- @param — name, type, and description for every parameter
- @returns — type and description
- @throws — list any exceptions that can be thrown
- @example — a realistic usage example

Function:
\`\`\`typescript
[paste function here]
\`\`\``,
        userId: user.id,
        itemTypeId: typeId("prompt"),
      },
    }),
    prisma.item.create({
      data: {
        title: "Refactoring assistance prompt",
        description: "Ask the model to refactor code and explain every decision",
        contentType: "TEXT",
        content: `Refactor the code below with these goals:
1. Improve readability (clear names, small functions)
2. Reduce complexity (cyclomatic and cognitive)
3. Apply relevant design patterns where beneficial
4. Ensure it remains functionally identical

For every change, explain what changed, why it's better, and any trade-offs.

\`\`\`
[paste code here]
\`\`\``,
        userId: user.id,
        itemTypeId: typeId("prompt"),
      },
    }),
  ])

  await prisma.itemCollection.createMany({
    data: aiItems.map((item) => ({ itemId: item.id, collectionId: aiWorkflows.id })),
  })
  console.log("Seeded AI Workflows (3 prompts)")

  // ── DevOps ────────────────────────────────────────────────────────────────
  const devOps = await prisma.collection.create({
    data: {
      name: "DevOps",
      description: "Infrastructure and deployment resources",
      userId: user.id,
    },
  })

  const devOpsItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Multi-stage Dockerfile (Node.js)",
        description: "Production-ready multi-stage Docker build for a Node.js app",
        contentType: "TEXT",
        language: "dockerfile",
        content: `FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]`,
        userId: user.id,
        itemTypeId: typeId("snippet"),
      },
    }),
    prisma.item.create({
      data: {
        title: "Deploy: build, push, and rollout",
        description: "Build Docker image, push to registry, and trigger a Kubernetes rollout",
        contentType: "TEXT",
        language: "bash",
        content: `IMAGE=registry.example.com/myapp
TAG=$(git rev-parse --short HEAD)

docker build -t $IMAGE:$TAG -t $IMAGE:latest .
docker push $IMAGE:$TAG
docker push $IMAGE:latest

kubectl set image deployment/myapp app=$IMAGE:$TAG
kubectl rollout status deployment/myapp`,
        userId: user.id,
        itemTypeId: typeId("command"),
      },
    }),
    prisma.item.create({
      data: {
        title: "Docker official documentation",
        description: "Official Docker docs — engine, Compose, and best practices",
        contentType: "LINK",
        url: "https://docs.docker.com",
        userId: user.id,
        itemTypeId: typeId("link"),
      },
    }),
    prisma.item.create({
      data: {
        title: "GitHub Actions documentation",
        description: "Reference for writing and debugging GitHub Actions workflows",
        contentType: "LINK",
        url: "https://docs.github.com/en/actions",
        userId: user.id,
        itemTypeId: typeId("link"),
      },
    }),
  ])

  await prisma.itemCollection.createMany({
    data: devOpsItems.map((item) => ({ itemId: item.id, collectionId: devOps.id })),
  })
  console.log("Seeded DevOps (1 snippet, 1 command, 2 links)")

  // ── Terminal Commands ─────────────────────────────────────────────────────
  const terminalCommands = await prisma.collection.create({
    data: {
      name: "Terminal Commands",
      description: "Useful shell commands for everyday development",
      userId: user.id,
    },
  })

  const terminalItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Git — pretty log & stash helpers",
        description: "Visualise branch history and manage stashes",
        contentType: "TEXT",
        language: "bash",
        content: `# Pretty branch graph
git log --oneline --graph --all --decorate

# List stashes with timestamps
git stash list --date=relative

# Apply latest stash and drop it
git stash pop

# Create a named stash
git stash push -m "wip: feature-x"`,
        userId: user.id,
        itemTypeId: typeId("command"),
      },
    }),
    prisma.item.create({
      data: {
        title: "Docker — cleanup commands",
        description: "Stop and remove all containers, prune unused images and volumes",
        contentType: "TEXT",
        language: "bash",
        content: `# Stop all running containers
docker stop $(docker ps -q)

# Remove all stopped containers
docker rm $(docker ps -aq)

# Remove dangling images
docker image prune -f

# Full system prune (images, containers, networks, build cache)
docker system prune -af --volumes`,
        userId: user.id,
        itemTypeId: typeId("command"),
      },
    }),
    prisma.item.create({
      data: {
        title: "Process management — kill by port",
        description: "Find and kill whatever process is holding a port",
        contentType: "TEXT",
        language: "bash",
        content: `# macOS / Linux
lsof -i :3000
kill -9 $(lsof -t -i:3000)

# Windows PowerShell
netstat -ano | findstr :3000
Stop-Process -Id <PID> -Force

# Cross-platform via npx
npx kill-port 3000`,
        userId: user.id,
        itemTypeId: typeId("command"),
      },
    }),
    prisma.item.create({
      data: {
        title: "Package manager — audit and upgrade",
        description: "Inspect dependencies and upgrade to latest versions safely",
        contentType: "TEXT",
        language: "bash",
        content: `# List top-level deps
npm ls --depth=0

# Show outdated packages
npm outdated

# Interactive upgrade with ncu
npx npm-check-updates -i

# Apply all upgrades then reinstall
npx npm-check-updates -u && npm install

# Audit and auto-fix
npm audit fix`,
        userId: user.id,
        itemTypeId: typeId("command"),
      },
    }),
  ])

  await prisma.itemCollection.createMany({
    data: terminalItems.map((item) => ({ itemId: item.id, collectionId: terminalCommands.id })),
  })
  console.log("Seeded Terminal Commands (4 commands)")

  // ── Design Resources ──────────────────────────────────────────────────────
  const designResources = await prisma.collection.create({
    data: {
      name: "Design Resources",
      description: "UI/UX resources and references",
      isFavorite: true,
      userId: user.id,
    },
  })

  const designItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Tailwind CSS documentation",
        description: "Full utility class reference for Tailwind CSS v4",
        contentType: "LINK",
        url: "https://tailwindcss.com/docs",
        userId: user.id,
        itemTypeId: typeId("link"),
      },
    }),
    prisma.item.create({
      data: {
        title: "shadcn/ui components",
        description: "Copy-paste component library built on Radix UI and Tailwind",
        contentType: "LINK",
        url: "https://ui.shadcn.com",
        userId: user.id,
        itemTypeId: typeId("link"),
      },
    }),
    prisma.item.create({
      data: {
        title: "Radix UI primitives",
        description: "Unstyled, accessible UI primitives for React",
        contentType: "LINK",
        url: "https://www.radix-ui.com",
        userId: user.id,
        itemTypeId: typeId("link"),
      },
    }),
    prisma.item.create({
      data: {
        title: "Lucide icon library",
        description: "Open-source icon set — browse and copy React component imports",
        contentType: "LINK",
        url: "https://lucide.dev/icons",
        userId: user.id,
        itemTypeId: typeId("link"),
      },
    }),
  ])

  await prisma.itemCollection.createMany({
    data: designItems.map((item) => ({ itemId: item.id, collectionId: designResources.id })),
  })
  console.log("Seeded Design Resources (4 links)")

  console.log("\nSeed complete.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())