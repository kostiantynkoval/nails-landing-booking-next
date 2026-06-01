import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { bookingService } from "@/services/booking/BookingService";

export const metadata: Metadata = {
  title: "My bookings",
  description: "View and manage your appointments.",
};

export default async function AccountBookingsPage() {
  const session = await auth();
  const bookings =
    session?.user?.id != null
      ? await bookingService.getClientBookings(session.user.id)
      : [];

  return (
    <main
      id="main-content"
      className="mx-auto max-w-2xl px-4 py-16 sm:px-6"
    >
      <h1 className="font-serif text-3xl font-semibold text-[var(--text-primary)]">
        My bookings
      </h1>
      {session?.user ? (
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Signed in as {session.user.email}
        </p>
      ) : null}

      {bookings.length === 0 ? (
        <p className="mt-8 text-[var(--text-muted)]">No appointments yet.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                  {booking.service.name}
                </h2>
                <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs font-medium text-[var(--text-muted)]">
                  {booking.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                with {booking.technician.name}
              </p>
              <p className="mt-1 text-sm text-[var(--text-primary)]">
                {booking.startTimeLocal} – {booking.endTimeLocal} (salon time)
              </p>
              <p className="mt-1 text-sm text-[var(--accent)]">
                {formatPrice(booking.service.price)}
              </p>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8">
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
