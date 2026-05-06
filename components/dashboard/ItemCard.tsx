import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File as FileIcon,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { mockItemTypes } from "@/lib/mock-data";

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File: FileIcon,
  Image: ImageIcon,
  Link: LinkIcon,
};

interface Item {
  id: string;
  title: string;
  description?: string | null;
  itemTypeId: string;
  tags: string[];
  createdAt: Date;
}

interface ItemCardProps {
  item: Item;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

export function ItemCard({ item }: ItemCardProps) {
  const itemType = mockItemTypes.find((t) => t.id === item.itemTypeId);
  const Icon = itemType ? ICON_MAP[itemType.icon] : null;

  return (
    <div className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-border/60 hover:bg-card/80">
      <div
        className="mt-0.5 shrink-0 rounded-md p-2"
        style={{ backgroundColor: itemType ? `${itemType.color}20` : "transparent" }}
      >
        {Icon && <Icon className="size-4" style={{ color: itemType?.color }} />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{item.title}</p>
        {item.description && (
          <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{item.description}</p>
        )}
        {item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <span className="mt-0.5 shrink-0 text-xs text-muted-foreground">
        {formatDate(item.createdAt)}
      </span>
    </div>
  );
}
