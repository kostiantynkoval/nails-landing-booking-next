import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { safeCallbackUrl } from "@/lib/auth-utils";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to book appointments at Maiia Nails.",
};

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl: raw } = await searchParams;
  const callbackUrl = safeCallbackUrl(raw, "/book");

  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col justify-center px-4 py-16"
    >
      <h1 className="font-serif text-3xl font-semibold text-[var(--text-primary)]">
        Sign in
      </h1>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Sign in to book appointments and manage your visits.
      </p>
      <div className="mt-8">
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </main>
  );
}
