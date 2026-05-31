import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { salonInfo } from "@/data/salon-services";

export const metadata: Metadata = {
  title: "Contact",
  description: "Hours, location, and how to reach Maiia Nails.",
};

export default function ContactPage() {
  return (
    <main id="main-content">
      <PageHeader
        title="Contact"
        description="Visit us in studio or reach out — we reply within one business day."
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 pb-16 sm:px-6 lg:grid-cols-2">
        <section aria-labelledby="contact-details-heading">
          <h2
            id="contact-details-heading"
            className="font-serif text-2xl font-semibold text-[var(--text-primary)]"
          >
            Get in touch
          </h2>
          <address className="mt-6 not-italic text-[var(--text-muted)]">
            <p className="font-semibold text-[var(--text-primary)]">{salonInfo.name}</p>
            <p className="mt-2">{salonInfo.address}</p>
            <p className="mt-4">
              <a
                href={`tel:${salonInfo.phone.replace(/\s/g, "")}`}
                className="text-[var(--accent)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                {salonInfo.phone}
              </a>
            </p>
            <p className="mt-2">
              <a
                href={`mailto:${salonInfo.email}`}
                className="text-[var(--accent)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                {salonInfo.email}
              </a>
            </p>
          </address>
          <section className="mt-8" aria-labelledby="hours-heading">
            <h3 id="hours-heading" className="font-serif text-lg font-semibold text-[var(--text-primary)]">
              Opening hours
            </h3>
            <dl className="mt-4 space-y-2 text-sm">
              {salonInfo.hours.map((row) => (
                <div key={row.days} className="flex justify-between gap-4 border-b border-[var(--border)] pb-2">
                  <dt className="text-[var(--text-muted)]">{row.days}</dt>
                  <dd className="font-medium text-[var(--text-primary)]">{row.time}</dd>
                </div>
              ))}
            </dl>
          </section>
        </section>
        <section aria-labelledby="map-heading">
          <h2 id="map-heading" className="sr-only">
            Location map
          </h2>
          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
            <iframe
              title={`Map showing ${salonInfo.name} location`}
              src={salonInfo.mapEmbedUrl}
              className="aspect-[4/3] w-full min-h-[280px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>
      </div>
    </main>
  );
}
