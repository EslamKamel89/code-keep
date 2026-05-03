"use client";

import { Search, Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background px-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input className="pl-8 pr-14" placeholder="Search items..." readOnly />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm">
          <FolderPlus />
          New Collection
        </Button>
        <Button size="sm">
          <Plus />
          New Item
        </Button>
      </div>
    </header>
  );
}
