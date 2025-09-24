import { Pool } from "pg";

export function getDBClient() {
  const pool = new Pool({
    user: "user",
    password: "password",
    host: "db",
    port: 5432,
    database: "reversi",
    max: 20,
  });
  return pool;
}
