"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  encryptSession,
  SESSION_COOKIE,
  SESSION_MAX_AGE_MS,
  sessionCookieOptions,
} from "@/lib/auth/session";
import { CMS_BASE, CMS_LOGIN } from "@/lib/cms";
import { fieldErrors, loginSchema, type FieldErrors } from "@/lib/validations";

export type AuthState = {
  error?: string;
  fieldErrors?: FieldErrors;
};

const DUMMY_HASH =
  "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

export async function login(
  _prev: AuthState | undefined,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  const admin = await prisma.admin.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  const matches = await bcrypt.compare(
    parsed.data.password,
    admin?.passwordHash ?? DUMMY_HASH,
  );

  if (!admin || !matches) {
    return { error: "Email or password is wrong." };
  }

  const expires = new Date(Date.now() + SESSION_MAX_AGE_MS);
  const token = await encryptSession(
    { userId: admin.id, email: admin.email },
    expires,
  );
  const store = await cookies();
  store.set({
    ...sessionCookieOptions(expires),
    value: token,
  });

  redirect(CMS_BASE);
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect(CMS_LOGIN);
}
