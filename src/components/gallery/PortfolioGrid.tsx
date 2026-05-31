import Image from "next/image";
import type { GalleryItem } from "@/services/gallery/types";

type PortfolioGridProps = {
  items: GalleryItem[];
  columns?: 2 | 3 | 4;
};

export function PortfolioGrid({ items, columns = 3 }: PortfolioGridProps) {
  const gridClass =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";

  if (items.length === 0) {
    return (
      <p className="text-center text-[var(--text-muted)]" role="status">
        No portfolio items match your filters.
      </p>
    );
  }

  return (
    <ul className={`grid gap-4 ${gridClass}`}>
      {items.map((item) => (
        <li key={item.id}>
          <article className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {item.title && (
              <div className="p-3">
                <h3 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
                  {item.title}
                </h3>
                {item.tags.length > 0 && (
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {item.tags.join(" · ")}
                  </p>
                )}
              </div>
            )}
          </article>
        </li>
      ))}
    </ul>
  );
}
