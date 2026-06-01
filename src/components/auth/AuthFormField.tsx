import { cn } from "@/lib/utils";

type AuthFormFieldProps = {
  id: string;
  label: string;
  type?: string;
  name: string;
  autoComplete?: string;
  required?: boolean;
  errors?: string[];
};

const inputClass =
  "mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";

export function AuthFormField({
  id,
  label,
  type = "text",
  name,
  autoComplete,
  required,
  errors,
}: AuthFormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--text-primary)]">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={errors?.length ? true : undefined}
        aria-describedby={errors?.length ? errorId : undefined}
        className={cn(inputClass, errors?.length ? "border-red-500" : undefined)}
      />
      {errors?.length ? (
        <p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}
