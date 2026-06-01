import { auth } from "@/lib/auth";
import { SiteHeaderClient } from "./SiteHeaderClient";

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user
    ? {
        name: session.user.name ?? "Account",
        email: session.user.email ?? "",
      }
    : null;

  return <SiteHeaderClient user={user} />;
}
