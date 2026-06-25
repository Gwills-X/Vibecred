import mysql from "mysql2/promise";

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      port: 3306,
    });

    console.log("Connected!");

    const [rows] = await connection.query("SHOW DATABASES");
    console.log(rows);

    await connection.end();
  } catch (err) {
    console.error(err);
  }
}

testConnection();
