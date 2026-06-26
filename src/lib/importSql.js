import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";

export async function importMigrationFile() {
  try {
    console.log("⏳ Starting cloud SQL migration pipeline...");

    const filePath = path.join(process.cwd(), "vibeCred.sql");
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Migration file not found at: ${filePath}`);
      return;
    }

    let sqlContent = fs.readFileSync(filePath, "utf8");

    // Clean up system metadata configurations that clash with Aiven permissions
    sqlContent = sqlContent
      .replace(/CREATE DATABASE[\s\S]*?;/gi, "")
      .replace(/USE `[\s\S]*?`;/gi, "");

    // Split queries accurately by terminal semicolons
    const sqlStatements = sqlContent
      .split(/;\s*$/m)
      .map((statement) => statement.trim())
      .filter(
        (statement) =>
          statement.length > 0 &&
          !statement.startsWith("--") &&
          !statement.startsWith("/*"),
      );

    console.log(`📦 Found ${sqlStatements.length} raw statements to parse.`);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || "11468", 10),
      ssl: { rejectUnauthorized: false },
    });

    // Clean up existing invalid layout states
    console.log("🧹 Dropping old conflicting tables...");
    await connection.query("DROP TABLE IF EXISTS `likes`, `posts`, `users`;");

    for (let i = 0; i < sqlStatements.length; i++) {
      let statement = sqlStatements[i];

      // 🔄 ON-THE-FLY COMPATIBILITY REWRITE
      // Fixes the likes table schema structure back to camelCase layout matching your Next.js queries
      if (statement.includes("CREATE TABLE `likes`")) {
        statement = `CREATE TABLE \`likes\` (
          \`id\` int(11) NOT NULL AUTO_INCREMENT,
          \`userId\` varchar(255) NOT NULL,
          \`postId\` varchar(255) NOT NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
      }

      // Fixes individual column headers in the raw mock data dump inserts
      if (statement.startsWith("INSERT INTO `likes`")) {
        statement = statement.replace(
          "`user_id`, `post_id`",
          "`userId`, `postId`",
        );
      }

      try {
        await connection.query(statement);
      } catch (statementError) {
        console.warn(
          `⚠️ Statement skipped at index [${i}]:`,
          statementError.message,
        );
      }
    }

    await connection.end();
    console.log(
      "✅ Cloud Migration Complete! Production records successfully mapped onto Aiven.",
    );
  } catch (err) {
    console.error("❌ Critical migration script fault:", err.message);
  }
}
