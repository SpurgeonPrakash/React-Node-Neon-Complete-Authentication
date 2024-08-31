import { pool } from "./db.js";

const createTableQueries = [
  `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(50) NOT NULL,
      lastname VARCHAR(50) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      loginplatform VARCHAR(50) NOT NULL,
      isverified BOOLEAN NOT NULL DEFAULT FALSE,
      auth jsonb[] DEFAULT ARRAY[]::jsonb[],
      isresetpasswordused BOOLEAN,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `,
];

export const initializeDb = async () => {
  const client = await pool.connect();
  try {
    for (const query of createTableQueries) {
      await client.query(query);
      console.log("Table checked/created successfully.");
    }
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    client.release();
  }
};
