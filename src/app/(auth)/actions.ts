"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn, signOut } from "@/lib/auth";
import { safeCallbackUrl } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AuthFormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return {
      errors: { email: ["An account with this email already exists"] },
    };
  }

  const passwordHash = await hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
      role: "CLIENT",
    },
  });

  const callbackUrl = safeCallbackUrl(
    formData.get("callbackUrl")?.toString(),
    "/book",
  );

  const result = await signIn("credentials", {
    email: normalizedEmail,
    password,
    redirect: false,
  });

  if (result?.error) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  redirect(callbackUrl);
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const callbackUrl = safeCallbackUrl(
    formData.get("callbackUrl")?.toString(),
    "/book",
  );

  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    return { message: "Invalid email or password" };
  }

  redirect(callbackUrl);
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
