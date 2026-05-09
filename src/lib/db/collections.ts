import { db } from "@/src/lib/db";

export async function getRecentCollections() {
  return db.collection.findMany({
    include: {
      items: {
        include: {
          item: {
            select: {
              itemType: {
                select: { id: true, name: true, icon: true, color: true },
              },
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 6,
  });
}

export type RecentCollection = Awaited<ReturnType<typeof getRecentCollections>>[number];
