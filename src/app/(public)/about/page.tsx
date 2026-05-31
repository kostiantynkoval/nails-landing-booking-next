import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { salonInfo } from "@/data/salon-services";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Maiia Nails — our story, values, and expert team.",
};

const whyChoose = [
  {
    title: "Artistry first",
    body: "Every set is shaped to your style — from minimal nudes to statement nail art.",
  },
  {
    title: "Hygiene & care",
    body: "Sterilized tools, quality products, and gentle prep for healthy natural nails.",
  },
  {
    title: "Thoughtful booking",
    body: "Real-time scheduling with conflict-safe reservations — no double-bookings.",
  },
] as const;

// TODO: Add team members from database
const team = [
  { name: "Maiia", role: "Lead artist · Gel & extensions" },
  { name: "Sofia", role: "Nail art · Pedicure specialist" },
] as const;

export default function AboutPage() {
  return (
    <main id="main-content">
      <PageHeader
        title={`About ${salonInfo.name}`}
        description={salonInfo.tagline}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-labelledby="story-heading">
        <h2 id="story-heading" className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
          Our story
        </h2>
        <p className="mt-4 max-w-3xl text-[var(--text-muted)] leading-relaxed">
          {salonInfo.name} is a boutique studio built for clients who want salon-quality
          results without the rush. We combine precision technique with creative design,
          whether you are here for a classic French gel or a full hand-painted set.
        </p>
      </section>
      <section
        className="border-t border-[var(--border)] bg-[var(--bg-secondary)]"
        aria-labelledby="why-heading"
      >
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 id="why-heading" className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
            Why choose us
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {whyChoose.map((item) => (
              <li key={item.title}>
                <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12 pb-16 sm:px-6" aria-labelledby="team-heading">
        <h2 id="team-heading" className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
          Meet the team
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {team.map((member) => (
            <li
              key={member.name}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6"
            >
              <h3 className="font-serif text-xl font-semibold text-[var(--text-primary)]">
                {member.name}
              </h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{member.role}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link
            href="/contact"
            className="text-sm font-semibold text-[var(--accent)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Get in touch
          </Link>
        </p>
      </section>
    </main>
  );
}
