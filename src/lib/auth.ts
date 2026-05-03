import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import {
  signToken,
  verifyToken,
  COOKIE_NAME,
  JWTPayload,
} from "./jwt";

export type { JWTPayload };
export { signToken, verifyToken };

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminFromRequest(
  request: NextRequest
): Promise<JWTPayload | null> {
  const token =
    request.cookies.get(COOKIE_NAME)?.value ??
    request.headers.get("Authorization")?.replace("Bearer ", "") ??
    null;

  if (!token) return null;
  return verifyToken(token);
}
