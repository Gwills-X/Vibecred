import "server-only";
import mysql from "mysql2/promise";

/**
 * Global variable to cache the pool across HMR (Hot Module Replacement)
 * in development environments, preventing "too many connections" errors.
 */
let pool = global.mysqlPool || null;

async function connectToDatabase() {
  if (pool) return pool;

  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || "11468", 10),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 90000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 5000,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    // Cache the pool in development
    if (process.env.NODE_ENV !== "production") {
      global.mysqlPool = pool;
    }

    console.log(
      "🚀 Production Aiven MySQL pool live. Media offloaded to Firebase.",
    );
    return pool;
  } catch (error) {
    console.error("❌ Cloud database connection fault:", error.message);
    throw error;
  }
}

/**
 * Executes a SQL query with integrated retry logic to handle ECONNRESET.
 */
export async function query(sql, values = [], retries = 2) {
  try {
    const db = await connectToDatabase();
    const [results] = await db.query(sql, values);
    return Array.isArray(results) ? results : [results];
  } catch (err) {
    if (err.code === "ECONNRESET" && retries > 0) {
      console.warn(
        `⚠️ Database sleeping. Waiting 5s to wake up... (${retries} attempts left)`,
      );

      // Add a 5-second delay before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000));

      return query(sql, values, retries - 1);
    }
    console.error("❌ SQL Execution Failure:", err.message);
    throw err;
  }
}
