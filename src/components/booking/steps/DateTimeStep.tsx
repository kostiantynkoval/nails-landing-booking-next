"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { getAvailableSlotsAction } from "@/app/actions/booking";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { BOOKING_STEPS, buildBookUrl } from "@/lib/booking-wizard";
import type { TimeSlot } from "@/services/booking/types";

type DateTimeStepProps = {
  serviceId: string;
  technicianId: string;
  minDate: string;
  selectedDate?: string;
  selectedSlot?: string;
};

export function DateTimeStep({
  serviceId,
  technicianId,
  minDate,
  selectedDate,
  selectedSlot,
}: DateTimeStepProps) {
  const router = useRouter();
  const slotsGroupId = useId();
  const [date, setDate] = useState(selectedDate ?? "");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slot, setSlot] = useState(selectedSlot ?? "");

  const fetchSlots = useCallback(
    async (localDate: string) => {
      setLoading(true);
      setError(null);
      const result = await getAvailableSlotsAction({
        technicianId,
        serviceId,
        localDate,
      });
      setLoading(false);
      if (!result.ok) {
        setSlots([]);
        setError(result.message);
        return;
      }
      setSlots(result.data);
      if (result.data.length === 0) {
        setError("No available times on this day. Try another date.");
      }
    },
    [technicianId, serviceId],
  );

  useEffect(() => {
    if (!date) return;
    // Fetch slots when the selected date changes (server action).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async data load
    void fetchSlots(date);
  }, [date, fetchSlots]);

  const handleDateSelect = (localDate: string) => {
    setDate(localDate);
    setSlot("");
    router.replace(
      buildBookUrl({
        step: BOOKING_STEPS.datetime,
        service: serviceId,
        technician: technicianId,
        date: localDate,
      }),
      { scroll: false },
    );
  };

  const handleSlotSelect = (startTimeUtc: string) => {
    setSlot(startTimeUtc);
    router.push(
      buildBookUrl({
        step: BOOKING_STEPS.confirm,
        service: serviceId,
        technician: technicianId,
        date,
        slot: startTimeUtc,
      }),
    );
  };

  return (
    <div>
      <h2 className="font-serif text-xl font-semibold text-[var(--text-primary)]">
        Choose date & time
      </h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Times shown in salon local time.
      </p>

      <div className="mt-6">
        <BookingCalendar
          minDate={minDate}
          selectedDate={date || undefined}
          onSelectDate={handleDateSelect}
        />
      </div>

      {date ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Available times
          </h3>
          <div
            aria-live="polite"
            aria-atomic="true"
            className="mt-2 min-h-[1.5rem] text-sm text-[var(--text-muted)]"
          >
            {loading
              ? "Loading available times…"
              : error
                ? error
                : `${slots.length} time${slots.length === 1 ? "" : "s"} available`}
          </div>
          {!loading && slots.length > 0 ? (
            <div
              role="radiogroup"
              aria-labelledby={slotsGroupId}
              id={slotsGroupId}
              className="mt-3 flex flex-wrap gap-2"
            >
              {slots.map((s) => {
                const checked = slot === s.startTimeUtc;
                return (
                  <label
                    key={s.startTimeUtc}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--accent)] ${
                      checked
                        ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)]"
                        : "border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="slot"
                      value={s.startTimeUtc}
                      checked={checked}
                      onChange={() => handleSlotSelect(s.startTimeUtc)}
                      className="sr-only"
                    />
                    {s.startTimeLocal}
                  </label>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      <p className="mt-6">
        <Link
          href={buildBookUrl({
            step: BOOKING_STEPS.service,
            service: serviceId,
            technician: technicianId,
          })}
          className="text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          Change technician
        </Link>
      </p>
    </div>
  );
}
