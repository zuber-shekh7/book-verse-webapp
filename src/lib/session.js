import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";
import { connectDB } from "./db";
import User from "@/models/User";

const COOKIE_NAME = "session";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set. Add it to .env.local");
  return new TextEncoder().encode(secret);
}

// Sessions are stateless JWTs, so deactivation must be checked here. Accounts without the field count as active.
const isAllowed = cache(async (userId) => {
  await connectDB();
  const user = await User.findById(userId).select("isActive").lean();
  return Boolean(user) && user.isActive !== false;
});

export async function createSession({ userId, role }) {
  const expiresAt = new Date(Date.now() + MAX_AGE_MS);
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getKey());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function readSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    if (!(await isAllowed(payload.userId))) return null;
    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}
