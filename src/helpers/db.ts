import mysql from "mysql";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "social_media",
});

export default connection;
