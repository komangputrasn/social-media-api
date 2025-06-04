import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "social_media",
});

export default connection;
