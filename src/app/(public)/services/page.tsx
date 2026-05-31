import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { PricingTable } from "@/components/services/PricingTable";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { salonServices } from "@/data/salon-services";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description: "Browse manicure, pedicure, nail art services and transparent pricing.",
};

export default function ServicesPage() {
  return (
    <main id="main-content">
      <PageHeader
        title="Services & Pricing"
        description="Tailored treatments with clear durations and prices. Book online when you're ready."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-labelledby="services-grid-heading">
        <h2 id="services-grid-heading" className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
          Our services
        </h2>
        <div className="mt-8">
          <ServicesGrid services={salonServices} />
        </div>
      </section>
      <section
        className="mx-auto max-w-6xl px-4 pb-16 sm:px-6"
        aria-labelledby="pricing-table-heading"
      >
        <h2 id="pricing-table-heading" className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
          Pricing overview
        </h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Final price may vary for add-ons and custom art — confirmed at booking.
        </p>
        <div className="mt-6">
          <PricingTable services={salonServices} />
        </div>
        <p className="mt-8 text-center">
          <Link
            href="/login?callbackUrl=/book"
            className="inline-flex rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-contrast)] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Book an appointment
          </Link>
        </p>
      </section>
    </main>
  );
}
