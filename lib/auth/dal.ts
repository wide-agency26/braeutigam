import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decryptSession, SESSION_COOKIE } from "./session";
import { CMS_LOGIN } from "@/lib/cms";

export const getSession = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return decryptSession(token);
});

export async function verifySession() {
  const session = await getSession();
  if (!session) {
    redirect(CMS_LOGIN);
  }
  return session;
}
