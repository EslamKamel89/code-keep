import { Package, FolderOpen, Star, Bookmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { mockCollections, mockItems } from "@/lib/mock-data";

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

const stats: Stat[] = [
  {
    label: "Total Items",
    value: mockItems.length,
    icon: Package,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-400/10",
  },
  {
    label: "Collections",
    value: mockCollections.length,
    icon: FolderOpen,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-400/10",
  },
  {
    label: "Favorite Items",
    value: mockItems.filter((i) => i.isFavorite).length,
    icon: Star,
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-400/10",
  },
  {
    label: "Favorite Collections",
    value: mockCollections.filter((c) => c.isFavorite).length,
    icon: Bookmark,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-400/10",
  },
];

export function StatsCards() {
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
