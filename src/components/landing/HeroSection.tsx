import Link from "next/link";
import Image from "next/image";
import { salonInfo } from "@/data/salon-services";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg-secondary)]"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
            Boutique nail studio
          </p>
          <h1
            id="hero-heading"
            className="mt-4 font-serif text-4xl font-semibold leading-tight text-[var(--text-primary)] sm:text-5xl"
          >
            {salonInfo.tagline}
          </h1>
          <p className="mt-6 max-w-lg text-lg text-[var(--text-muted)]">
            Discover custom designs and book tailored gel, art, and spa treatments
            with a seamless online experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/book"
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-contrast)] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Book an appointment
            </Link>
            <Link
              href="/gallery"
              className="rounded-full border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              View our work
            </Link>
          </div>
        </div>
        <div
          className="relative aspect-[4/5] max-h-[480px] w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--accent-light)] to-[var(--bg-primary)] dark:from-[#2a2a2a] dark:to-[var(--bg-primary)]"
          aria-hidden="true"
        >
          <div className="absolute inset-0 flex items-center justify-center font-serif text-2xl text-[var(--accent)]">
            <Image src="/images/portfolio/logo-square.jpg" alt="Maiia Nails" width={731} height={631} />
          </div>
        </div>
      </div>
    </section>
  );
}
