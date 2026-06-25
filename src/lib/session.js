import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;

// Fail-fast Guard: Crash the server immediately if the developer forgets the .env key
if (!secretKey) {
  throw new Error(
    "CRITICAL CONFIGURATION ERROR: process.env.SESSION_SECRET is unassigned.",
  );
}

const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Standard internal JWT exp registry tracker
    .sign(encodedKey);
}

export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("Session token decryption failed:", error.message);
    return null;
  }
}

export async function createSession(userId) {
  // 7 Days calculation matched cleanly to cookie expiration requirements
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + sevenDaysInMs);

  // Normalize userId to a string to keep database primary key formats matching smoothly
  const session = await encrypt({ userId: String(userId) });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Adaptive fallback for non-SSL localhost dev environments
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}
