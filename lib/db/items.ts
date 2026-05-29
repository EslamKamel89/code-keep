import { db } from "@/lib/db";

export async function getPinnedItems() {
  return db.item.findMany({
    where: { isPinned: true },
    include: {
      itemType: { select: { id: true, name: true, icon: true, color: true } },
      tags: { include: { tag: { select: { name: true } } } },
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });
}

export async function getRecentItems() {
  return db.item.findMany({
    include: {
      itemType: { select: { id: true, name: true, icon: true, color: true } },
      tags: { include: { tag: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

export async function getDashboardStats() {
  const [totalItems, totalCollections, favoriteItems, favoriteCollections] =
    await Promise.all([
      db.item.count(),
      db.collection.count(),
      db.item.count({ where: { isFavorite: true } }),
      db.collection.count({ where: { isFavorite: true } }),
    ]);
  return { totalItems, totalCollections, favoriteItems, favoriteCollections };
}

export type PinnedItem = Awaited<ReturnType<typeof getPinnedItems>>[number];
export type RecentItem = Awaited<ReturnType<typeof getRecentItems>>[number];
