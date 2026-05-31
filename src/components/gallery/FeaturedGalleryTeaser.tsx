import Link from "next/link";
import { galleryService } from "@/services/gallery/GalleryService";
import { PortfolioGrid } from "./PortfolioGrid";

export async function FeaturedGalleryTeaser() {
  const items = await galleryService.getFeatured(4);

  return (
    <section aria-labelledby="featured-gallery-heading" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="featured-gallery-heading"
            className="font-serif text-3xl font-semibold text-[var(--text-primary)]"
          >
            Featured work
          </h2>
          <p className="mt-2 text-[var(--text-muted)]">
            A glimpse of our latest designs and finishes.
          </p>
        </div>
        <Link
          href="/gallery"
          className="text-sm font-semibold text-[var(--accent)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          View full gallery
        </Link>
      </div>
      <div className="mt-8">
        <PortfolioGrid items={items} columns={4} />
      </div>
    </section>
  );
}
