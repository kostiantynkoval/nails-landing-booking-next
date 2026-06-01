"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction, type AuthFormState } from "@/app/(auth)/actions";
import { AuthFormField } from "./AuthFormField";

const initialState: AuthFormState = {};

type RegisterFormProps = {
  callbackUrl: string;
};

export function RegisterForm({ callbackUrl }: RegisterFormProps) {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {state.message ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100" role="alert">
          {state.message}
        </p>
      ) : null}

      <AuthFormField
        id="name"
        name="name"
        label="Full name"
        autoComplete="name"
        required
        errors={state.errors?.name}
      />
      <AuthFormField
        id="email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        errors={state.errors?.email}
      />
      <AuthFormField
        id="password"
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        required
        errors={state.errors?.password}
      />
      <AuthFormField
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        required
        errors={state.errors?.confirmPassword}
      />

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-contrast)] hover:opacity-90 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-[var(--text-muted)]">
        Already have an account?{" "}
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="font-semibold text-[var(--accent)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
