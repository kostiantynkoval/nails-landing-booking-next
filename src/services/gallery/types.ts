export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  tags: string[];
  featured: boolean;
  sortOrder: number;
};

export type GalleryQuery = {
  tags?: string[];
  featuredOnly?: boolean;
  limit?: number;
};

export type GallerySource = {
  getAll(query?: GalleryQuery): Promise<GalleryItem[]>;
  getFeatured(limit?: number): Promise<GalleryItem[]>;
  getTags(): Promise<string[]>;
};
