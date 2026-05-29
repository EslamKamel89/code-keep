import { Package, FolderOpen, Star, Bookmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getDashboardStats } from "@/lib/db/items";

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export async function StatsCards() {
  const { totalItems, totalCollections, favoriteItems, favoriteCollections } =
    await getDashboardStats();

  const stats: Stat[] = [
    {
      label: "Total Items",
      value: totalItems,
      icon: Package,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-400/10",
    },
    {
      label: "Collections",
      value: totalCollections,
      icon: FolderOpen,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-400/10",
    },
    {
      label: "Favorite Items",
      value: favoriteItems,
      icon: Star,
      iconColor: "text-yellow-400",
      iconBg: "bg-yellow-400/10",
    },
    {
      label: "Favorite Collections",
      value: favoriteCollections,
      icon: Bookmark,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
          >
            <div className={`rounded-md p-2.5 ${stat.iconBg}`}>
              <Icon className={`size-5 ${stat.iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}