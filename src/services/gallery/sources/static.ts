import { portfolioManifest } from "@/data/portfolio.manifest";
import type { GalleryItem, GalleryQuery, GallerySource } from "../types";

function toGalleryItem(item: (typeof portfolioManifest)[number]): GalleryItem {
  return {
    id: item.id,
    src: item.src,
    alt: item.alt,
    title: item.title,
    description: item.description,
    tags: item.tags,
    featured: item.featured,
    sortOrder: item.sortOrder,
  };
}

function filterItems(items: GalleryItem[], query?: GalleryQuery): GalleryItem[] {
  let result = [...items].sort((a, b) => a.sortOrder - b.sortOrder);

  if (query?.featuredOnly) {
    result = result.filter((item) => item.featured);
  }

  if (query?.tags?.length) {
    const tagSet = new Set(query.tags.map((t) => t.toLowerCase()));
    result = result.filter((item) =>
      item.tags.some((tag) => tagSet.has(tag.toLowerCase())),
    );
  }

  if (query?.limit != null) {
    result = result.slice(0, query.limit);
  }

  return result;
}

export const staticGallerySource: GallerySource = {
  async getAll(query) {
    return filterItems(portfolioManifest.map(toGalleryItem), query);
  },

  async getFeatured(limit = 6) {
    return filterItems(portfolioManifest.map(toGalleryItem), {
      featuredOnly: true,
      limit,
    });
  },

  async getTags() {
    const tags = new Set<string>();
    for (const item of portfolioManifest) {
      for (const tag of item.tags) {
        tags.add(tag);
      }
    }
    return [...tags].sort();
  },
};
