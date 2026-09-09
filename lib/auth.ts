import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { UserRole } from "@/lib/models/User";

const AUTH_COOKIE_NAME = "auth_token";

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET environment variable is missing or shorter than 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export interface AuthSessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

/**
 * Sign a new JWT session token
 */
export async function signAuthToken(payload: AuthSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

/**
 * Verify and decode an existing JWT session token
 */
export async function verifyAuthToken(token: string): Promise<AuthSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

/**
 * Get current session from incoming request cookies
 */
export async function getSession(): Promise<AuthSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}

/**
 * Set HTTP-only secure authentication cookie
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

/**
 * Clear session cookie (Logout)
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Helper to extract client IP from incoming request headers
 */
export async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    if (forwardedFor) {
      const ip = forwardedFor.split(",")[0].trim();
      if (ip) return ip;
    }
    const realIp = headerList.get("x-real-ip");
    if (realIp) return realIp.trim();

    const cfIp = headerList.get("cf-connecting-ip");
    if (cfIp) return cfIp.trim();

    return "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
}

/**
 * Guard: Requires user to be authenticated in Server Actions
 */
export async function requireAuth(): Promise<AuthSessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED: You must be logged in to perform this action.");
  }
  return session;
}

/**
 * Guard: Requires user to have 'admin' role in Server Actions
 */
export async function requireAdmin(): Promise<AuthSessionPayload> {
  const session = await requireAuth();
  if (session.role !== "admin") {
    throw new Error("FORBIDDEN: Admin privileges are required for this action.");
  }
  return session;
}
