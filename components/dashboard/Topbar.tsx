"use client";

import { Menu, Search, Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TopbarProps {
  onMobileSidebarToggle?: () => void;
}

export function Topbar({ onMobileSidebarToggle }: TopbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      {/* Mobile: hamburger */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMobileSidebarToggle}>
        <Menu className="size-4" />
      </Button>

      {/* Desktop: full search bar */}
      <div className="relative hidden md:flex flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input className="pl-8 pr-14" placeholder="Search items..." readOnly />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      {/* Mobile: search icon */}
      <Button variant="ghost" size="icon" className="md:hidden">
        <Search className="size-4" />
      </Button>

      <div className="flex items-center gap-2 ml-auto">
        {/* Desktop: text buttons */}
        <Button variant="outline" size="sm" className="hidden md:flex">
          <FolderPlus />
          New Collection
        </Button>
        <Button size="sm" className="hidden md:flex">
          <Plus />
          New Item
        </Button>

        {/* Mobile: icon-only buttons */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <FolderPlus className="size-4" />
        </Button>
        <Button size="icon" className="md:hidden">
          <Plus className="size-4" />
        </Button>
      </div>
    </header>
  );
}
