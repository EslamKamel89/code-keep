export const dynamic = "force-dynamic";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CollectionsGrid } from "@/components/dashboard/CollectionsGrid";
import { PinnedItems } from "@/components/dashboard/PinnedItems";
import { RecentItems } from "@/components/dashboard/RecentItems";
import { getSidebarItemTypes, getSidebarCollections } from "@/lib/db/sidebar";
import type { SidebarData } from "@/lib/db/sidebar";
import { computeDominantColor } from "@/lib/utils";

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
      itemCount: col._count.items,
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
