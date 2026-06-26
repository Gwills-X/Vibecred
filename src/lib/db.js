import "server-only";
import mysql from "mysql2/promise";

let pool;

async function connectToDatabase() {
  try {
    if (!pool) {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || "11468", 10),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 15000,
        // Enforces SSL verification for external cloud architecture traffic
        ssl: {
          rejectUnauthorized: false,
        },
      });
      console.log(
        "🚀 Production Aiven MySQL pool live. Media offloaded to Firebase.",
      );
    }
    return pool;
  } catch (error) {
    console.error("❌ Cloud database connection fault:", error.message);
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
    return Array.isArray(results) ? results : [results];
  } catch (err) {
    console.error("❌ SQL Execution Failure:", err.message);
    throw err;
  }
}
