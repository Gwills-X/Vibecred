import { query } from "@/lib/db";

/**
 * Finds a local MySQL user by their unique email address
 */
export async function findMysqlUserByEmail(email) {
  const rows = await query("SELECT * FROM users WHERE email = ?", [email]);
  if (!rows || rows.length === 0) return null;
  return rows[0];
}

/**
 * Inserts a new user record into MySQL and returns their auto-incremented ID
 */
export async function insertMysqlUser({ id, name, email, hashedPassword }) {
  const sql =
    "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)";
  await query(sql, [id, name, email, hashedPassword]);
  return id;
}

/**
 * Updates user profile information in MySQL
 */
export async function updateMysqlUser(userId, data) {
  const sql = `UPDATE users SET name = ?, bio = ?, github_handle = ?, website_url = ?, location = ?, profile_pic_url = ? WHERE id = ?`;

  // 🔍 DEBUG: Inspect the parameters being passed to the SQL query
  console.log("Service: Executing SQL with params:", [
    data.name,
    data.bio,
    data.github_handle,
    data.website_url,
    data.location,
    data.profile_pic_url,
    userId,
  ]);

  try {
    const result = await query(sql, [
      data.name,
      data.bio,
      data.github_handle,
      data.website_url,
      data.location,
      data.profile_pic_url,
      userId,
    ]);
    return result;
  } catch (error) {
    // 🔍 DEBUG: If the database fails, you MUST see the error here
    console.error("Service: Database Update Failed:", error);
    throw error;
  }
}

export async function getUserPassword(userId) {
  const rows = await query("SELECT password FROM users WHERE id = ?", [userId]);
  return rows[0];
}
export async function updatePassword(userId, hashedPassword) {
  await query("UPDATE users SET password = ? WHERE id = ?", [
    hashedPassword,
    userId,
  ]);
}
