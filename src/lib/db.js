import "server-only";
import mysql from "mysql2/promise";

let pool;

async function connectToDatabase() {
  try {
    if (!pool) {
      pool = mysql.createPool({
        host: "127.0.0.1", // Enforced direct loopback to bypass local DNS resolution latency
        user: "root",
        password: "",
        database: "nextjs_test",
        port: 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 10000,
      });
      console.log("Database connection pool securely initialized.");
    }
    return pool;
  } catch (error) {
    console.error("Database connection fault:", error.message);
    throw error;
  }
}

export async function query(sql, values = []) {
  try {
    const db = await connectToDatabase();
    if (!db) {
      throw new Error(
        "Pool allocation returned an uninitialized driver resource.",
      );
    }

    const [results] = await db.execute(sql, values);

    // Always guarantee an array structure back to the dataEngine mapper layers
    return Array.isArray(results) ? results : [results];
  } catch (err) {
    console.error("SQL Execution Failure:", err.message);
    throw err;
  }
}
