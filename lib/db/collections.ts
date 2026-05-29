import { db } from "@/lib/db";

export async function getRecentCollections() {
  return db.collection.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      isFavorite: true,
      _count: { select: { items: true } },
      items: {
        take: 10,
        select: {
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
