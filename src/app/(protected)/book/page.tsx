import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Book appointment",
  description: "Book your nail appointment at Maiia Nails.",
};

export default async function BookPage() {
  const session = await auth();

  return (
    <main
      id="main-content"
      className="mx-auto max-w-2xl px-4 py-16 sm:px-6"
    >
      <h1 className="font-serif text-3xl font-semibold text-[var(--text-primary)]">
        Book an appointment
      </h1>
      {session?.user ? (
        <p className="mt-4 text-[var(--text-muted)]">
          Welcome, {session.user.name}. The multi-step booking wizard arrives in Phase 5.
        </p>
      ) : null}
      <p className="mt-6 text-sm text-[var(--text-muted)]">
        <Link href="/services" className="text-[var(--accent)] hover:underline">
          Browse services
        </Link>{" "}
        while we finish the booking flow.
      </p>
    </main>
  );
}
