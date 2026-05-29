import { Clock } from "lucide-react";
import { ItemCard } from "./ItemCard";
import { getRecentItems } from "@/lib/db/items";

export async function RecentItems() {
  const recentItems = await getRecentItems();

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Clock className="size-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Recent Items</h2>
      </div>
      <div className="flex flex-col gap-2">
        {recentItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}