import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { ServiceItem } from "@/services/booking/types";

type ServicesGridProps = {
  services: ServiceItem[];
};

export function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {services.map((service) => (
        <li key={service.id}>
          <article className="flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            <h3 className="font-serif text-xl font-semibold text-[var(--text-primary)]">
              {service.name}
            </h3>
            <p className="mt-2 flex-1 text-sm text-[var(--text-muted)]">
              {service.description ?? ""}
            </p>
            <dl className="mt-4 flex gap-4 text-sm">
              <div>
                <dt className="text-[var(--text-muted)]">Duration</dt>
                <dd className="font-medium text-[var(--text-primary)]">
                  {service.durationMin} min
                </dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)]">From</dt>
                <dd className="font-medium text-[var(--accent)]">
                  {formatPrice(service.price)}
                </dd>
              </div>
            </dl>
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(`/book?service=${service.id}`)}`}
              className="mt-4 text-sm font-semibold text-[var(--accent)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Book this service
            </Link>
          </article>
        </li>
      ))}
    </ul>
  );
}
