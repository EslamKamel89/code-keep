import "dotenv/config"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

function pass(msg: string) { console.log(`  ✓ ${msg}`) }
function fail(msg: string) { console.error(`  ✗ ${msg}`); failures++ }

let failures = 0

async function main() {
  console.log("── System Item Types ────────────────────────────────────────────")
  const itemTypes = await prisma.itemType.findMany({ orderBy: { name: "asc" } })
  for (const t of itemTypes) {
    console.log(`    ${t.name.padEnd(10)} color=${t.color}  icon=${t.icon}  isSystem=${t.isSystem}`)
  }
  const systemTypes = itemTypes.filter((t) => t.isSystem)
  const expectedTypes = ["snippet", "prompt", "command", "note", "file", "image", "link"]
  const missing = expectedTypes.filter((n) => !systemTypes.find((t) => t.name === n))
  if (missing.length > 0) fail(`Missing system types: ${missing.join(", ")}`)
  else pass(`All 7 system types present`)

  console.log("\n── Demo User ────────────────────────────────────────────────────")
  const user = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
  })
  if (!user) {
    fail("Demo user not found")
  } else {
    pass(`User found: ${user.name} <${user.email}>`)
    if (user.password) pass("Password hash present")
    else fail("Password hash missing")
    if (user.emailVerified) pass(`emailVerified: ${user.emailVerified.toISOString()}`)
    else fail("emailVerified is null")
    if (!user.isPro) pass("isPro: false")
    else fail("isPro should be false")
  }

  console.log("\n── Collections ──────────────────────────────────────────────────")
  const collections = await prisma.collection.findMany({
    include: { items: { include: { item: { include: { itemType: true } } } } },
    orderBy: { name: "asc" },
  })
  const expectedCollections = [
    { name: "AI Workflows",      itemCount: 3 },
    { name: "Design Resources",  itemCount: 4 },
    { name: "DevOps",            itemCount: 4 },
    { name: "React Patterns",    itemCount: 3 },
    { name: "Terminal Commands", itemCount: 4 },
  ]
  if (collections.length === 5) pass(`5 collections found`)
  else fail(`Expected 5 collections, got ${collections.length}`)

  for (const expected of expectedCollections) {
    const col = collections.find((c) => c.name === expected.name)
    if (!col) {
      fail(`Collection "${expected.name}" not found`)
      continue
    }
    const count = col.items.length
    if (count === expected.itemCount) {
      pass(`"${expected.name}" — ${count} items`)
    } else {
      fail(`"${expected.name}" — expected ${expected.itemCount} items, got ${count}`)
    }
  }

  const designResources = collections.find((c) => c.name === "Design Resources")
  if (designResources?.isFavorite) pass(`"Design Resources" is favorited`)
  else fail(`"Design Resources" should be favorited`)

  console.log("\n── Items by Type ────────────────────────────────────────────────")
  const items = await prisma.item.findMany({
    include: { itemType: true },
    orderBy: { title: "asc" },
  })
  const byType = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.itemType.name] = (acc[item.itemType.name] ?? 0) + 1
    return acc
  }, {})

  const expectedByType: Record<string, number> = {
    snippet: 4,
    prompt:  3,
    command: 5,
    link:    6,
  }
  for (const [type, count] of Object.entries(expectedByType)) {
    const actual = byType[type] ?? 0
    if (actual === count) pass(`${type}: ${actual} items`)
    else fail(`${type}: expected ${count}, got ${actual}`)
  }

  console.log("\n── Content Checks ───────────────────────────────────────────────")
  const textItems = items.filter((i) => i.contentType === "TEXT")
  const linkItems = items.filter((i) => i.contentType === "LINK")
  pass(`TEXT items: ${textItems.length}`)
  pass(`LINK items: ${linkItems.length}`)

  const itemsWithContent = textItems.filter((i) => i.content && i.content.length > 0)
  if (itemsWithContent.length === textItems.length) pass("All TEXT items have content")
  else fail(`${textItems.length - itemsWithContent.length} TEXT items missing content`)

  const itemsWithUrl = linkItems.filter((i) => i.url && i.url.startsWith("https://"))
  if (itemsWithUrl.length === linkItems.length) pass("All LINK items have a valid URL")
  else fail(`${linkItems.length - itemsWithUrl.length} LINK items missing/invalid URL`)

  const snippetsWithLang = items.filter((i) => i.itemType.name === "snippet" && i.language)
  if (snippetsWithLang.length === (byType["snippet"] ?? 0)) pass("All snippets have a language set")
  else fail(`${(byType["snippet"] ?? 0) - snippetsWithLang.length} snippets missing language`)

  console.log("\n── Summary ──────────────────────────────────────────────────────")
  if (failures === 0) {
    console.log("  All checks passed.\n")
  } else {
    console.error(`  ${failures} check(s) failed.\n`)
    process.exit(1)
  }
}

main()
  .catch((err) => {
    console.error("✗ Database test failed:", err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())