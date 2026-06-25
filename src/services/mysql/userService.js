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
