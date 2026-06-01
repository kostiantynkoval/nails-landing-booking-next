export const dynamic = "force-dynamic";

import Link from "next/link";
import { SkipLink } from "@/components/layout/SkipLink";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { salonInfo } from "@/data/salon-services";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipLink />
      <header className="border-b border-[var(--border)] bg-[var(--bg-primary)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="font-serif text-xl font-semibold text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            {salonInfo.name}
          </Link>
          <ThemeToggle />
        </div>
      </header>
      {children}
    </>
  );
}
