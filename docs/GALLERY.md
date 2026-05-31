# Gallery source strategy

## MVP (current)

- Images: `public/images/portfolio/`
- Metadata: `src/data/portfolio.manifest.ts`
- API: `galleryService` → `StaticGallerySource` (default)
- Env: `GALLERY_SOURCE=static` (default)

## Instagram integration (planned)

Set `GALLERY_SOURCE=instagram` and implement `src/services/gallery/sources/instagram.ts`.

Options to decide before build:

| Approach | Pros | Cons |
|----------|------|------|
| **Instagram-only** | Single source of truth; no admin uploads | API limits, token refresh, embed SEO limits |
| **Hybrid** | Manifest/DB for hero + IG for feed | Two sources to keep in sync |
| **DB cache of IG posts** | Offline/SEO friendly | Sync job + optional `PortfolioItem` model |

## Admin `/admin/portfolio` — deferred

Do **not** add Prisma `PortfolioItem` or `/admin/portfolio` until the gallery source decision is made:

- **Instagram-only:** Admin needs account connection settings only (no image CRUD).
- **Hybrid / uploads:** Add `PortfolioItem` + storage (e.g. Vercel Blob) in Phase 7, not Phase 0.

UI pages (`/`, `/gallery`) must only call `galleryService` — never Prisma or manifest directly from components.
