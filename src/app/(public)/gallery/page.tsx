import type { Metadata } from "next";
import { GalleryWithFilters } from "@/components/gallery/GalleryWithFilters";
import { PageHeader } from "@/components/layout/PageHeader";
import { galleryService } from "@/services/gallery/GalleryService";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Explore our nail art, gel designs, and spa finishes.",
};

export default async function GalleryPage() {
  const [items, tags] = await Promise.all([
    galleryService.getAll(),
    galleryService.getTags(),
  ]);

  return (
    <main id="main-content">
      <PageHeader
        title="Gallery"
        description="Browse our portfolio. Filter by style to find inspiration for your next visit."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 pb-16 sm:px-6">
        <GalleryWithFilters items={items} tags={tags} />
      </section>
    </main>
  );
}
