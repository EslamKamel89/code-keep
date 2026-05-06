import { Star, MoreHorizontal } from "lucide-react";
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
import { mockItems, mockItemTypes } from "@/lib/mock-data";

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File: FileIcon,
  Image: ImageIcon,
  Link: LinkIcon,
};

interface Collection {
  id: string;
  name: string;
  description?: string | null;
  isFavorite: boolean;
  itemIds: string[];
}

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const itemsInCollection = mockItems.filter((item) =>
    collection.itemIds.includes(item.id)
  );
  const typeIds = [...new Set(itemsInCollection.map((i) => i.itemTypeId))];
  const types = typeIds
    .map((id) => mockItemTypes.find((t) => t.id === id))
    .filter((t): t is (typeof mockItemTypes)[number] => t !== undefined);

  return (
    <div className="group flex cursor-pointer flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-border/60 hover:bg-card/80">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-semibold text-foreground">{collection.name}</h3>
            {collection.isFavorite && (
              <Star className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {collection.itemIds.length} {collection.itemIds.length === 1 ? "item" : "items"}
          </p>
        </div>
        <button className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100">
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      {collection.description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">{collection.description}</p>
      )}

      {types.length > 0 && (
        <div className="mt-auto flex items-center gap-1.5 pt-1">
          {types.map((type) => {
            const Icon = ICON_MAP[type.icon];
            return Icon ? (
              <div
                key={type.id}
                className="rounded p-1"
                style={{ backgroundColor: `${type.color}20` }}
                title={type.name}
              >
                <Icon className="size-3" style={{ color: type.color }} />
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
