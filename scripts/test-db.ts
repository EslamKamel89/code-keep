import "dotenv/config"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Connecting to database…\n")

  // 1. Check system item types were seeded correctly
  const itemTypes = await prisma.itemType.findMany({
    orderBy: { name: "asc" },
  })
  console.log(`✓ ItemTypes (${itemTypes.length} found):`)
  for (const t of itemTypes) {
    console.log(`  • ${t.name.padEnd(10)} color=${t.color}  icon=${t.icon}  isSystem=${t.isSystem}`)
  }

  // 2. Verify all 7 system types are present
  const systemTypes = itemTypes.filter((t) => t.isSystem)
  const expected = ["snippet", "prompt", "command", "note", "file", "image", "link"]
  const missing = expected.filter((n) => !systemTypes.find((t) => t.name === n))
  if (missing.length > 0) {
    console.error(`\n✗ Missing system types: ${missing.join(", ")}`)
  } else {
    console.log(`\n✓ All 7 system types present`)
  }

  // 3. Basic table counts
  const [userCount, itemCount, collectionCount, tagCount] = await Promise.all([
    prisma.user.count(),
    prisma.item.count(),
    prisma.collection.count(),
    prisma.tag.count(),
  ])
  console.log("\n✓ Table row counts:")
  console.log(`  users=${userCount}  items=${itemCount}  collections=${collectionCount}  tags=${tagCount}`)

  console.log("\n✓ Database connection OK")
}

main()
  .catch((err) => {
    console.error("✗ Database test failed:", err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())