import Link from "next/link";

type SuccessStepProps = {
  appointmentId: string;
  userName?: string | null;
};

export function SuccessStep({ appointmentId, userName }: SuccessStepProps) {
  return (
    <div className="text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
        Booking confirmed
      </p>
      <h2 className="mt-4 font-serif text-3xl font-semibold text-[var(--text-primary)]">
        You&apos;re all set{userName ? `, ${userName}` : ""}!
      </h2>
      <p className="mt-4 text-[var(--text-muted)]">
        Your appointment has been reserved. Reference:
      </p>
      <p className="mt-2 font-mono text-sm text-[var(--text-primary)]">
        {appointmentId}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/account/bookings"
          className="inline-flex justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-contrast)] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          View my bookings
        </Link>
        <Link
          href="/"
          className="inline-flex justify-center rounded-full border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
