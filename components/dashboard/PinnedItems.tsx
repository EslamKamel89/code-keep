import { getPinnedItems } from "@/lib/db/items";
import { Pin } from "lucide-react";
import { ItemCard } from "./ItemCard";

export async function PinnedItems() {
  const pinnedItems = await getPinnedItems();

  if (pinnedItems.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Pin className="size-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Pinned</h2>
      </div>
      <div className="flex flex-col gap-2">
        {pinnedItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
