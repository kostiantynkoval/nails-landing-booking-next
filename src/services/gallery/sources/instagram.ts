import type { GalleryItem, GallerySource } from "../types";

function notImplemented(): never {
  throw new Error(
    "Instagram gallery source is not implemented. Use GALLERY_SOURCE=static or complete src/services/gallery/sources/instagram.ts",
  );
}

/**
 * Future Instagram gallery source.
 * Set GALLERY_SOURCE=instagram and implement Graph API / oEmbed fetch here.
 */
export const instagramGallerySource: GallerySource = {
  getAll(): Promise<GalleryItem[]> {
    notImplemented();
  },

  getFeatured(): Promise<GalleryItem[]> {
    notImplemented();
  },

  getTags(): Promise<string[]> {
    notImplemented();
  },
};
