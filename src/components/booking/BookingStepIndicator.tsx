import { BOOKING_STEPS, STEP_LABELS, type BookingStep } from "@/lib/booking-wizard";

type BookingStepIndicatorProps = {
  currentStep: BookingStep;
};

const orderedSteps = [
  BOOKING_STEPS.service,
  BOOKING_STEPS.technician,
  BOOKING_STEPS.datetime,
  BOOKING_STEPS.confirm,
] as const;

export function BookingStepIndicator({ currentStep }: BookingStepIndicatorProps) {
  if (currentStep === BOOKING_STEPS.success) {
    return null;
  }

  return (
    <nav aria-label="Booking progress" className="mb-8">
      <ol className="flex flex-wrap gap-2">
        {orderedSteps.map((step) => {
          const isCurrent = step === currentStep;
          const isComplete = step < currentStep;
          return (
            <li key={step}>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  isCurrent
                    ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                    : isComplete
                      ? "border border-[var(--accent)] text-[var(--accent)]"
                      : "border border-[var(--border)] text-[var(--text-muted)]"
                }`}
                aria-current={isCurrent ? "step" : undefined}
              >
                {step}. {STEP_LABELS[step]}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
