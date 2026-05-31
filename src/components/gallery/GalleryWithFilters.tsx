"use client";

import { useMemo, useState } from "react";
import type { GalleryItem } from "@/services/gallery/types";
import { PortfolioGrid } from "./PortfolioGrid";

type GalleryWithFiltersProps = {
  items: GalleryItem[];
  tags: string[];
};

export function GalleryWithFilters({ items, tags }: GalleryWithFiltersProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!activeTag) return items;
    
    return items.filter((item) =>
      item.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase()),
    );
  }, [items, activeTag]);

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter gallery by tag"
      >
        <button
          type="button"
          aria-pressed={activeTag === null}
          onClick={() => setActiveTag(null)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
            activeTag === null
              ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
              : "border border-[var(--border)] text-[var(--text-muted)]"
          }`}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            aria-pressed={activeTag === tag}
            onClick={() => setActiveTag(tag)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
              activeTag === tag
                ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                : "border border-[var(--border)] text-[var(--text-muted)]"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="mt-8" aria-live="polite" aria-atomic="true">
        <p className="sr-only">
          {filtered.length} {filtered.length === 1 ? "item" : "items"} shown
        </p>
        <PortfolioGrid items={filtered} />
      </div>
    </div>
  );
}
