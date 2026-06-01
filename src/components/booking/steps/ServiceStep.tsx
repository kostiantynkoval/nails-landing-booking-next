"use client";

import { useRouter } from "next/navigation";
import { useId } from "react";
import { BOOKING_STEPS, buildBookUrl } from "@/lib/booking-wizard";
import { formatPrice } from "@/lib/utils";
import type { ServiceItem } from "@/services/booking/types";

type ServiceStepProps = {
  services: ServiceItem[];
  selectedId?: string;
};

export function ServiceStep({ services, selectedId }: ServiceStepProps) {
  const router = useRouter();
  const groupId = useId();

  const handleSelect = (id: string) => {
    router.push(
      buildBookUrl({ step: BOOKING_STEPS.technician, service: id }),
    );
  };

  return (
    <fieldset>
      <legend
        id={groupId}
        className="font-serif text-xl font-semibold text-[var(--text-primary)]"
      >
        Choose a service
      </legend>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Select one treatment to continue.
      </p>
      <div
        role="radiogroup"
        aria-labelledby={groupId}
        className="mt-6 space-y-3"
      >
        {services.map((service) => {
          const checked = selectedId === service.id;
          return (
            <label
              key={service.id}
              className={`flex cursor-pointer gap-4 rounded-xl border p-4 transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--accent)] ${
                checked
                  ? "border-[var(--accent)] bg-[var(--accent-light)]/20"
                  : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)]"
              }`}
            >
              <input
                type="radio"
                name="service"
                value={service.id}
                checked={checked}
                onChange={() => handleSelect(service.id)}
                className="mt-1 h-4 w-4 accent-[var(--accent)]"
              />
              <span className="flex-1">
                <span className="font-medium text-[var(--text-primary)]">
                  {service.name}
                </span>
                {service.description ? (
                  <span className="mt-1 block text-sm text-[var(--text-muted)]">
                    {service.description}
                  </span>
                ) : null}
                <span className="mt-2 block text-sm text-[var(--accent)]">
                  {service.durationMin} min · {formatPrice(service.price)}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
