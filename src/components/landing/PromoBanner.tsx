import Link from "next/link";

export function PromoBanner() {
  return (
    <section
      aria-labelledby="promo-heading"
      className="mx-auto max-w-6xl px-4 py-8 sm:px-6"
    >
      <div className="rounded-2xl border border-[var(--accent)] bg-[var(--accent-light)]/30 px-6 py-8 text-center dark:bg-[var(--accent)]/10">
        <h2
          id="promo-heading"
          className="font-serif text-2xl font-semibold text-[var(--text-primary)]"
        >
          New client offer
        </h2>
        <p className="mt-2 text-[var(--text-muted)]">
          15% off your first gel manicure when you book online this month.
        </p>
        <Link
          href="/services"
          className="mt-4 inline-block text-sm font-semibold text-[var(--accent)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          See services & pricing
        </Link>
      </div>
    </section>
  );
}
