import pkg from "pg";
import { PGDATABASE, PGHOST, PGPASSWORD, PGUSER } from "../config/index.js";

const { Pool } = pkg;

export const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: true,
});
