import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { auth } from "@/lib/auth";
import { salonTodayLocalDate } from "@/lib/timezone";
import { bookingService } from "@/services/booking/BookingService";

export const metadata: Metadata = {
  title: "Book appointment",
  description: "Book your nail appointment at Maiia Nails.",
};

type BookPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookPage({ searchParams }: BookPageProps) {
  const session = await auth();
  const resolvedParams = await searchParams;
  const [services, technicians] = await Promise.all([
    bookingService.getServices(),
    bookingService.getTechnicians(),
  ]);

  const minDate = salonTodayLocalDate();

  return (
    <main
      id="main-content"
      className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16"
    >
      <h1 className="font-serif text-3xl font-semibold text-[var(--text-primary)]">
        Book an appointment
      </h1>
      {session?.user ? (
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Signed in as {session.user.name ?? session.user.email}
        </p>
      ) : null}
      <div className="mt-8">
        <BookingWizard
          services={services}
          technicians={technicians}
          minDate={minDate}
          searchParams={resolvedParams}
          userName={session?.user?.name}
        />
      </div>
    </main>
  );
}
