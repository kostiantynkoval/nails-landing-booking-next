import type { Metadata } from "next";
import Link from "next/link";
import { SkipLink } from "@/components/layout/SkipLink";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to book appointments at Maiia Nails.",
};

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl = "/book" } = await searchParams;

  return (
    <>
      <SkipLink />
      <main
        id="main-content"
        className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-16"
      >
        <h1 className="font-serif text-3xl font-semibold text-[var(--text-primary)]">
          Sign in
        </h1>
        <p className="mt-4 text-[var(--text-muted)]">
          Authentication is coming in Phase 1. After sign-in you will be redirected to:
        </p>
        <p className="mt-2 break-all text-sm font-mono text-[var(--accent)]">{callbackUrl}</p>
        <Link
          href="/"
          className="mt-8 text-sm font-semibold text-[var(--accent)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          ← Back to home
        </Link>
      </main>
    </>
  );
}
