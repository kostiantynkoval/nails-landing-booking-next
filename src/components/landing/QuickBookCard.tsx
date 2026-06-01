"use client";

import Link from "next/link";
import { useState } from "react";
import { BOOKING_STEPS, buildBookUrl } from "@/lib/booking-wizard";
import type { ServiceItem } from "@/services/booking/types";

type QuickBookCardProps = {
  services: ServiceItem[];
};

export function QuickBookCard({ services }: QuickBookCardProps) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");

  const bookUrl = buildBookUrl({
    step: BOOKING_STEPS.technician,
    service: serviceId,
  });

  return (
    <section
      aria-labelledby="quick-book-heading"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6"
    >
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 shadow-sm sm:p-8">
        <h2
          id="quick-book-heading"
          className="font-serif text-2xl font-semibold text-[var(--text-primary)]"
        >
          Quick book
        </h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Choose a service to continue. Sign in is required if you are not already logged in.
        </p>
        <form className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" onSubmit={(e) => e.preventDefault()}>
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="quick-service" className="block text-sm font-medium text-[var(--text-primary)]">
              Service
            </label>
            <select
              id="quick-service"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Link
              href={bookUrl}
              className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-contrast)] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Continue booking
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
