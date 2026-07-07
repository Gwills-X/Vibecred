import "server-only"; // Enforce server-side execution isolation
import { cookies } from "next/headers";
import { decrypt } from "./session";
import { query } from "./db"; // 🚀 Import your query manager

export default async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return null; // Gracefully return null if no token exists
    } // Attempt to decrypt and unpack the session payload

    const userPayload = await decrypt(sessionCookie);

    if (!userPayload || !userPayload.userId) {
      return null; // Safety gate for expired or structurally invalid payloads
    } // 🚀 Fetch full account metadata from your MySQL users table

    const dbUsers = await query("SELECT * FROM users WHERE id = ?", [
      userPayload.userId,
    ]);

    if (!dbUsers || dbUsers.length === 0) {
      return null; // Handle case where cookie exists but user was purged from DB
    } // Return the session tracking markers combined with real profile properties!

    return {
      userId: String(dbUsers[0].id),
      name: dbUsers[0].name,
      email: dbUsers[0].email,
      location: dbUsers[0].location,
      github_handle: dbUsers[0].github_handle,
      website_url: dbUsers[0].website_url,
      profile_pic_url: dbUsers[0].profile_pic_url,
      bio: dbUsers[0].bio,
      password: dbUsers[0].password, // Include hashed password for server-side validation
      iat: userPayload.iat,
      exp: userPayload.exp,
    };
  } catch (error) {
    console.error("Session structural check error:", error.message);
    return null; // Always fallback to a clean falsy state instead of crashing the route
  }
}
