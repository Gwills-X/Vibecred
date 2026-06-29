import "server-only";
import { cookies } from "next/headers";
import { decrypt } from "./session";
import { query } from "./db";

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) return null;

    const userPayload = await decrypt(sessionCookie);

    // If decryption fails or payload is missing, return null
    if (!userPayload?.userId) return null;

    // Time Check
    const now = Math.floor(Date.now() / 1000);
    if (userPayload.exp && now > userPayload.exp) {
      return null;
    }

    const dbUsers = await query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [userPayload.userId],
    );

    if (!dbUsers?.length) return null;

    return {
      userId: String(dbUsers[0].id),
      name: dbUsers[0].name,
      email: dbUsers[0].email,
      exp: userPayload.exp,
    };
  } catch (error) {
    // Return null silently for structural errors to avoid crashing the UI
    return null;
  }
}
