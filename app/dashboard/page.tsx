import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CollectionsGrid } from "@/components/dashboard/CollectionsGrid";
import { PinnedItems } from "@/components/dashboard/PinnedItems";
import { RecentItems } from "@/components/dashboard/RecentItems";
import { getSidebarItemTypes, getSidebarCollections } from "@/src/lib/db/sidebar";
import type { SidebarData } from "@/src/lib/db/sidebar";

function computeDominantColor(
  items: { item: { itemType: { id: string; color: string } } }[]
): string | null {
  if (items.length === 0) return null;
  const counts = new Map<string, { color: string; count: number }>();
  for (const { item } of items) {
    const { id, color } = item.itemType;
    const entry = counts.get(id);
    counts.set(id, { color, count: (entry?.count ?? 0) + 1 });
  }
  return [...counts.values()].sort((a, b) => b.count - a.count)[0].color;
}

export default async function DashboardPage() {
  const [rawItemTypes, rawCollections] = await Promise.all([
    getSidebarItemTypes(),
    getSidebarCollections(),
  ]);

  const sidebarData: SidebarData = {
    itemTypes: rawItemTypes.map((t) => ({
      id: t.id,
      name: t.name,
      icon: t.icon,
      color: t.color,
      count: t._count.items,
    })),
    collections: rawCollections.map((col) => ({
      id: col.id,
      name: col.name,
      isFavorite: col.isFavorite,
      itemCount: col.items.length,
      dominantColor: computeDominantColor(col.items),
    })),
  };

  return (
    <DashboardShell sidebarData={sidebarData}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your developer knowledge hub</p>
      </div>
      <div className="space-y-8">
        <StatsCards />
        <CollectionsGrid />
        <PinnedItems />
        <RecentItems />
      </div>
    </DashboardShell>
  );
}
