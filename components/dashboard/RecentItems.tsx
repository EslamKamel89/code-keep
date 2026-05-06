import { Clock } from "lucide-react";
import { ItemCard } from "./ItemCard";
import { mockItems } from "@/lib/mock-data";

export function RecentItems() {
  const recentItems = [...mockItems]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);

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
