import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { SESSION_COOKIE, SESSION_MAX_AGE_MS } from "./constants";

export type AdminSession = {
  userId: string;
  email: string;
};

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export async function encryptSession(session: AdminSession, expiresAt: Date) {
  const key = secretKey();
  if (!key) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters.");
  }

  return new SignJWT({ email: session.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(key);
}

export async function decryptSession(
  token: string | undefined,
): Promise<AdminSession | null> {
  if (!token) return null;
  const key = secretKey();
  if (!key) return null;

  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payloadToSession(payload);
  } catch {
    return null;
  }
}

function payloadToSession(payload: JWTPayload): AdminSession | null {
  const userId = typeof payload.sub === "string" ? payload.sub : "";
  const email = typeof payload.email === "string" ? payload.email : "";
  if (!userId || !email) return null;
  return { userId, email };
}

export function sessionCookieOptions(expires: Date) {
  return {
    name: SESSION_COOKIE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires,
  };
}

export { SESSION_COOKIE, SESSION_MAX_AGE_MS };
