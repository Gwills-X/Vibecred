import "server-only";
import { cookies } from "next/headers";
import { decrypt } from "./session";
import { query } from "./db";

export default async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) return null;

    const userPayload = await decrypt(sessionCookie);

    if (!userPayload || !userPayload.userId) return null;

    // 🚀 TIME CHECK: Compare expiration claim against current time
    // userPayload.exp is usually in seconds, so we multiply by 1000 for ms
    const now = Math.floor(Date.now() / 1000);
    if (userPayload.exp && now > userPayload.exp) {
      console.warn("Session expired. Logging out user.");
      return null; // Will trigger standard logout/redirect flow
    }

    const dbUsers = await query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [userPayload.userId],
    );

    if (!dbUsers || dbUsers.length === 0) return null;

    return {
      userId: String(dbUsers[0].id),
      name: dbUsers[0].name,
      email: dbUsers[0].email,
      iat: userPayload.iat,
      exp: userPayload.exp,
    };
  } catch (error) {
    console.error("Session structural check error:", error.message);
    return null;
  }
}
