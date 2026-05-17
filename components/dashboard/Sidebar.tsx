"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File as FileIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Star,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { mockUser } from "@/lib/mock-data";
import type { SidebarData } from "@/src/lib/db/sidebar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const PRO_TYPES = new Set(["file", "image"]);

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File: FileIcon,
  Image: ImageIcon,
  Link: LinkIcon,
};

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  sidebarData: SidebarData;
}

export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onMobileClose, sidebarData }: SidebarProps) {
  const [typesExpanded, setTypesExpanded] = useState(true);
  const [collectionsExpanded, setCollectionsExpanded] = useState(true);
  const [favoritesExpanded, setFavoritesExpanded] = useState(true);
  const [allCollectionsExpanded, setAllCollectionsExpanded] = useState(true);

  const favoriteCollections = sidebarData.collections.filter((c) => c.isFavorite);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-border bg-sidebar transition-all duration-300 overflow-hidden",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0",
        collapsed ? "md:w-14 w-60" : "w-60"
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center border-b border-border shrink-0 px-3">
        {collapsed ? (
          <div className="size-7 rounded-md bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-xs font-bold mx-auto">
            CK
          </div>
        ) : (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold text-sidebar-foreground flex-1 min-w-0"
            onClick={onMobileClose}
          >
            <div className="size-7 rounded-md bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-xs font-bold shrink-0">
              CK
            </div>
            <span>CodeKeep</span>
          </Link>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden md:flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors shrink-0"
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onMobileClose}
          className="md:hidden size-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-sidebar-foreground shrink-0"
        >
          <ChevronLeft className="size-4" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto py-3 space-y-1 sidebar-scroll">
        {/* Types section */}
        <div className="px-3">
          {!collapsed && (
            <button
              type="button"
              onClick={() => setTypesExpanded((p) => !p)}
              className="flex w-full items-center justify-between text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-2 hover:text-sidebar-foreground transition-colors"
            >
              <span>Types</span>
              <ChevronDown
                className={cn("size-3 transition-transform", !typesExpanded && "-rotate-90")}
              />
            </button>
          )}
          {(typesExpanded || collapsed) && (
            <nav className="space-y-0.5">
              {sidebarData.itemTypes.map((type) => {
                const Icon = ICON_MAP[type.icon];
                return (
                  <Link
                    key={type.id}
                    href={`/items/${type.name}`}
                    onClick={onMobileClose}
                    title={collapsed ? type.name : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      collapsed && "justify-center"
                    )}
                  >
                    {Icon && <Icon className="size-4 shrink-0" style={{ color: type.color }} />}
                    {!collapsed && (
                      <>
                        <span className="flex-1 capitalize">{type.name}</span>
                        {PRO_TYPES.has(type.name) && (
                          <Badge variant="outline" className="h-4 px-1 text-[10px] font-semibold text-muted-foreground border-muted-foreground/40">
                            PRO
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{type.count}</span>
                      </>
                    )}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Collections section */}
        {!collapsed && (
          <div className="px-3 pt-2">
            <div className="h-px bg-border mb-3" />
            <button
              type="button"
              onClick={() => setCollectionsExpanded((p) => !p)}
              className="flex w-full items-center justify-between text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 hover:text-sidebar-foreground transition-colors"
            >
              <span>Collections</span>
              <ChevronDown
                className={cn("size-3 transition-transform", !collectionsExpanded && "-rotate-90")}
              />
            </button>

            {collectionsExpanded && (
              <div className="ml-2 border-l border-border pl-2 space-y-3">
                {/* Favorites */}
                {favoriteCollections.length > 0 && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setFavoritesExpanded((p) => !p)}
                      className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground px-2 mb-1 hover:text-sidebar-foreground transition-colors"
                    >
                      <span>Favorites</span>
                      <ChevronDown className={cn("size-3 transition-transform", !favoritesExpanded && "-rotate-90")} />
                    </button>
                    {favoritesExpanded && <nav className="space-y-0.5">
                      {favoriteCollections.map((col) => (
                        <Link
                          key={col.id}
                          href={`/collections/${col.id}`}
                          onClick={onMobileClose}
                          className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                        >
                          <Star className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
                          <span className="flex-1 truncate">{col.name}</span>
                          <span className="text-xs text-muted-foreground">{col.itemCount}</span>
                        </Link>
                      ))}
                    </nav>}
                  </div>
                )}

                {/* All collections */}
                <div>
                  <button
                    type="button"
                    onClick={() => setAllCollectionsExpanded((p) => !p)}
                    className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground px-2 mb-1 hover:text-sidebar-foreground transition-colors"
                  >
                    <span>All Collections</span>
                    <ChevronDown className={cn("size-3 transition-transform", !allCollectionsExpanded && "-rotate-90")} />
                  </button>
                  {allCollectionsExpanded && <>
                  <nav className="space-y-0.5">
                    {sidebarData.collections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/collections/${col.id}`}
                        onClick={onMobileClose}
                        className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      >
                        <span
                          className="size-2 rounded-full shrink-0"
                          style={{ backgroundColor: col.dominantColor ?? "#6b7280" }}
                        />
                        <span className="flex-1 truncate">{col.name}</span>
                        <span className="text-xs text-muted-foreground">{col.itemCount}</span>
                      </Link>
                    ))}
                  </nav>
                  <Link
                    href="/collections"
                    onClick={onMobileClose}
                    className="mt-1 flex items-center px-2 py-1 text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors"
                  >
                    View all collections →
                  </Link>
                  </>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User area */}
      <div className="border-t border-border p-3 shrink-0">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-md p-2 hover:bg-sidebar-accent transition-colors cursor-pointer",
            collapsed && "justify-center"
          )}
        >
          <div className="size-7 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-xs font-bold shrink-0">
            {mockUser.name.charAt(0)}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{mockUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">{mockUser.email}</p>
              </div>
              <Settings className="size-4 text-muted-foreground shrink-0" />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
