"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBookingAction } from "@/app/actions/booking";
import { BOOKING_STEPS, buildBookUrl } from "@/lib/booking-wizard";
import { formatPrice } from "@/lib/utils";
import { formatSalonLocalTime } from "@/lib/timezone";
import type { ServiceItem, TechnicianItem } from "@/services/booking/types";

type ConfirmStepProps = {
  service: ServiceItem;
  technician: TechnicianItem;
  localDate: string;
  slotUtc: string;
};

export function ConfirmStep({
  service,
  technician,
  localDate,
  slotUtc,
}: ConfirmStepProps) {
  const slotDate = new Date(slotUtc);
  const slotLabel = Number.isNaN(slotDate.getTime())
    ? slotUtc
    : formatSalonLocalTime(slotDate);
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [slotTaken, setSlotTaken] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSlotTaken(false);

    const result = await createBookingAction({
      technicianId: technician.id,
      serviceId: service.id,
      startTimeUtc: slotUtc,
      notes: notes.trim() || undefined,
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      setSlotTaken(result.code === "SLOT_TAKEN");
      return;
    }

    router.push(
      buildBookUrl({
        step: BOOKING_STEPS.success,
        appointment: result.data.id,
      }),
    );
  };

  return (
    <div>
      <h2 className="font-serif text-xl font-semibold text-[var(--text-primary)]">
        Confirm your booking
      </h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Review details before confirming.
      </p>

      <dl className="mt-6 space-y-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--text-muted)]">Service</dt>
          <dd className="text-right font-medium text-[var(--text-primary)]">
            {service.name}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--text-muted)]">Technician</dt>
          <dd className="text-right font-medium text-[var(--text-primary)]">
            {technician.name}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--text-muted)]">Date</dt>
          <dd className="text-right font-medium text-[var(--text-primary)]">
            {localDate}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--text-muted)]">Time</dt>
          <dd className="text-right font-medium text-[var(--text-primary)]">
            {slotLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-[var(--border)] pt-3">
          <dt className="text-[var(--text-muted)]">Price</dt>
          <dd className="text-right font-semibold text-[var(--accent)]">
            {formatPrice(service.price)}
          </dd>
        </div>
      </dl>

      <ul className="mt-4 flex flex-wrap gap-3 text-sm">
        <li>
          <Link
            href={buildBookUrl({
              step: BOOKING_STEPS.service,
              service: service.id,
            })}
            className="text-[var(--accent)] hover:underline"
          >
            Edit service
          </Link>
        </li>
        <li>
          <Link
            href={buildBookUrl({
              step: BOOKING_STEPS.technician,
              service: service.id,
              technician: technician.id,
            })}
            className="text-[var(--accent)] hover:underline"
          >
            Edit technician
          </Link>
        </li>
        <li>
          <Link
            href={buildBookUrl({
              step: BOOKING_STEPS.datetime,
              service: service.id,
              technician: technician.id,
              date: localDate,
              slot: slotUtc,
            })}
            className="text-[var(--accent)] hover:underline"
          >
            Edit date & time
          </Link>
        </li>
      </ul>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
          >
            {error}
            {slotTaken ? (
              <>
                {" "}
                <Link
                  href={buildBookUrl({
                    step: BOOKING_STEPS.datetime,
                    service: service.id,
                    technician: technician.id,
                    date: localDate,
                  })}
                  className="font-semibold underline"
                >
                  Pick another time
                </Link>
              </>
            ) : null}
          </p>
        ) : null}

        <div>
          <label
            htmlFor="booking-notes"
            className="block text-sm font-medium text-[var(--text-primary)]"
          >
            Notes (optional)
          </label>
          <textarea
            id="booking-notes"
            name="notes"
            rows={3}
            maxLength={500}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            placeholder="Allergies, design preferences, etc."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-contrast)] hover:opacity-90 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          {submitting ? "Confirming…" : "Confirm booking"}
        </button>
      </form>
    </div>
  );
}
