import { ICON_MAP } from "@/lib/icon-map";
import { formatDate } from "@/lib/utils";

interface Item {
  id: string;
  title: string;
  description?: string | null;
  itemType: { name: string; icon: string; color: string };
  tags: { tag: { name: string } }[];
  createdAt: Date;
}

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const Icon = ICON_MAP[item.itemType.icon] ?? null;
  const tagNames = item.tags.map((t) => t.tag.name);

  return (
    <div className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-border/60 hover:bg-card/80">
      <div
        className="mt-0.5 shrink-0 rounded-md p-2"
        style={{ backgroundColor: `${item.itemType.color}20` }}
      >
        {Icon && <Icon className="size-4" style={{ color: item.itemType.color }} />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{item.title}</p>
        {item.description && (
          <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{item.description}</p>
        )}
        {tagNames.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tagNames.map((tag) => (
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
