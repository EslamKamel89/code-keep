import { CollectionCard } from "./CollectionCard";
import { mockCollections } from "@/lib/mock-data";

export function CollectionsGrid() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Collections</h2>
        <button className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockCollections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}
