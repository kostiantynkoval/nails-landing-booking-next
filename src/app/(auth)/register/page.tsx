import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { safeCallbackUrl } from "@/lib/auth-utils";

export const metadata: Metadata = {
  title: "Create account",
  description: "Register to book appointments at Maiia Nails.",
};

type RegisterPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { callbackUrl: raw } = await searchParams;
  const callbackUrl = safeCallbackUrl(raw, "/book");

  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col justify-center px-4 py-16"
    >
      <h1 className="font-serif text-3xl font-semibold text-[var(--text-primary)]">
        Create account
      </h1>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Register to book services online. All bookings require an account.
      </p>
      <div className="mt-8">
        <RegisterForm callbackUrl={callbackUrl} />
      </div>
    </main>
  );
}
