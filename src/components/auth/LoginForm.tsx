"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type AuthFormState } from "@/app/(auth)/actions";
import { AuthFormField } from "./AuthFormField";

const initialState: AuthFormState = {};

type LoginFormProps = {
  callbackUrl: string;
};

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {state.message ? (
        <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200" role="alert">
          {state.message}
        </p>
      ) : null}

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
        autoComplete="current-password"
        required
        errors={state.errors?.password}
      />

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-contrast)] hover:opacity-90 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-[var(--text-muted)]">
        No account?{" "}
        <Link
          href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="font-semibold text-[var(--accent)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
