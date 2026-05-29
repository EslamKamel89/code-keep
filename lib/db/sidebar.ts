import { db } from "@/lib/db";

export async function getSidebarItemTypes() {
  return db.itemType.findMany({
    select: {
      id: true,
      name: true,
      icon: true,
      color: true,
      _count: { select: { items: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getSidebarCollections() {
  return db.collection.findMany({
    select: {
      id: true,
      name: true,
      isFavorite: true,
      _count: { select: { items: true } },
      items: {
        take: 20,
        select: {
          item: {
            select: {
              itemType: { select: { id: true, color: true } },
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export type SidebarItemType = {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
};

export type SidebarCollection = {
  id: string;
  name: string;
  isFavorite: boolean;
  itemCount: number;
  dominantColor: string | null;
};

export type SidebarData = {
  itemTypes: SidebarItemType[];
  collections: SidebarCollection[];
};
