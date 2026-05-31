import { instagramGallerySource } from "./sources/instagram";
import { staticGallerySource } from "./sources/static";
import type { GalleryItem, GalleryQuery, GallerySource } from "./types";

function resolveSource(): GallerySource {
  const source = process.env.GALLERY_SOURCE ?? "static";
  if (source === "instagram") {
    return instagramGallerySource;
  }
  return staticGallerySource;
}

/** UI-facing gallery API — swap source via GALLERY_SOURCE env */
export const galleryService = {
  getAll(query?: GalleryQuery): Promise<GalleryItem[]> {
    return resolveSource().getAll(query);
  },

  getFeatured(limit?: number): Promise<GalleryItem[]> {
    return resolveSource().getFeatured(limit);
  },

  getTags(): Promise<string[]> {
    return resolveSource().getTags();
  },
};
