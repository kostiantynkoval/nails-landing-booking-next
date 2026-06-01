"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { BOOKING_STEPS, buildBookUrl } from "@/lib/booking-wizard";
import type { TechnicianItem } from "@/services/booking/types";

type TechnicianStepProps = {
  technicians: TechnicianItem[];
  serviceId: string;
  selectedId?: string;
};

export function TechnicianStep({
  technicians,
  serviceId,
  selectedId,
}: TechnicianStepProps) {
  const router = useRouter();
  const groupId = useId();

  const handleSelect = (technicianId: string) => {
    router.push(
      buildBookUrl({
        step: BOOKING_STEPS.datetime,
        service: serviceId,
        technician: technicianId,
      }),
    );
  };

  return (
    <fieldset>
      <legend
        id={groupId}
        className="font-serif text-xl font-semibold text-[var(--text-primary)]"
      >
        Choose a technician
      </legend>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Pick who you would like for this appointment.
      </p>
      <div
        role="radiogroup"
        aria-labelledby={groupId}
        className="mt-6 space-y-3"
      >
        {technicians.map((tech) => {
          const checked = selectedId === tech.id;
          return (
            <label
              key={tech.id}
              className={`flex cursor-pointer gap-4 rounded-xl border p-4 transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--accent)] ${
                checked
                  ? "border-[var(--accent)] bg-[var(--accent-light)]/20"
                  : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)]"
              }`}
            >
              <input
                type="radio"
                name="technician"
                value={tech.id}
                checked={checked}
                onChange={() => handleSelect(tech.id)}
                className="mt-1 h-4 w-4 accent-[var(--accent)]"
              />
              <span className="flex-1">
                <span className="font-medium text-[var(--text-primary)]">
                  {tech.name}
                </span>
                {tech.bio ? (
                  <span className="mt-1 block text-sm text-[var(--text-muted)]">
                    {tech.bio}
                  </span>
                ) : null}
                {tech.specialties.length > 0 ? (
                  <span className="mt-2 block text-xs text-[var(--text-muted)]">
                    {tech.specialties.join(" · ")}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      <p className="mt-6">
        <Link
          href={buildBookUrl({ step: BOOKING_STEPS.service, service: serviceId })}
          className="text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          ← Change service
        </Link>
      </p>
    </fieldset>
  );
}
