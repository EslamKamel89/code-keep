import { CollectionCard } from "./CollectionCard";
import { getRecentCollections } from "@/src/lib/db/collections";

export async function CollectionsGrid() {
  const collections = await getRecentCollections();

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Collections</h2>
        <button type="button" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}
