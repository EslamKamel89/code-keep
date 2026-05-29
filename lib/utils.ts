import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function computeDominantColor(
  items: { item: { itemType: { id: string; color: string } } }[]
): string | null {
  if (items.length === 0) return null;
  const counts = new Map<string, { color: string; count: number }>();
  for (const { item } of items) {
    const { id, color } = item.itemType;
    const entry = counts.get(id);
    counts.set(id, { color, count: (entry?.count ?? 0) + 1 });
  }
  return [...counts.values()].sort((a, b) => b.count - a.count)[0].color;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}
