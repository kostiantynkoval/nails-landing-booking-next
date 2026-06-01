import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config (no Prisma). Used by middleware.
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      const isProtected =
        pathname.startsWith("/book") ||
        pathname.startsWith("/account") ||
        pathname.startsWith("/admin");

      if (!isProtected) {
        return true;
      }

      if (!auth?.user) {
        return false;
      }

      if (pathname.startsWith("/admin")) {
        const role = auth.user.role;
        return role === "ADMIN" || role === "TECHNICIAN";
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
