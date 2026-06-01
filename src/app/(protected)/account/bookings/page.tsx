import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "My bookings",
  description: "View and manage your appointments.",
};

export default async function AccountBookingsPage() {
  const session = await auth();

  return (
    <main
      id="main-content"
      className="mx-auto max-w-2xl px-4 py-16 sm:px-6"
    >
      <h1 className="font-serif text-3xl font-semibold text-[var(--text-primary)]">
        My bookings
      </h1>
      {session?.user ? (
        <p className="mt-4 text-[var(--text-muted)]">
          Signed in as {session.user.email}. Appointment list coming in Phase 6.
        </p>
      ) : null}
      <p className="mt-6">
        <Link
          href="/book"
          className="text-sm font-semibold text-[var(--accent)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          Book a new appointment
        </Link>
      </p>
    </main>
  );
}
