import Link from "next/link";
import { salonInfo } from "@/data/salon-services";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-serif text-lg font-semibold text-[var(--text-primary)]">
            {salonInfo.name}
          </p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{salonInfo.tagline}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/services" className="text-[var(--text-muted)] hover:text-[var(--accent)]">
                Services & Pricing
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="text-[var(--text-muted)] hover:text-[var(--accent)]">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-[var(--text-muted)] hover:text-[var(--accent)]">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-[var(--text-muted)] hover:text-[var(--accent)]">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
            <li>
              <a href={`tel:${salonInfo.phone.replace(/\s/g, "")}`}>{salonInfo.phone}</a>
            </li>
            <li>
              <a href={`mailto:${salonInfo.email}`}>{salonInfo.email}</a>
            </li>
            <li>{salonInfo.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)] px-4 py-4 text-center text-xs text-[var(--text-muted)]">
        © {year} {salonInfo.name}. All rights reserved.
      </div>
    </footer>
  );
}
