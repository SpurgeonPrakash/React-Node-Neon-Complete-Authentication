import jwt from "jsonwebtoken";
import CustomError from "./CustomError.js";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from "../config/index.js";
import { pool } from "../db/db.js";

export const generateAccessToken = (userId: string) => {
  if (!ACCESS_TOKEN_SECRET) {
    throw new CustomError("Access Token Secret Not Found", 404);
  }
  return jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY / 1000,
  });
};

// Generate refresh token
export const generateRefreshToken = (userId: string) => {
  if (!REFRESH_TOKEN_SECRET) {
    throw new CustomError("Refresh Token Secret Not Found", 404);
  }
  return jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY / 1000,
  });
};

export const invalidateAllRefreshTokens = async (userId: string) => {
  const client = await pool.connect();
  const query = "SELECT * FROM users WHERE id = $1";
  const values = [userId];
  const result = await client.query(query, values);
  if (result.rows.length === 0) {
    throw new CustomError("Unauthorized", 401);
  }
  const updateQuery = `
    UPDATE users
    SET auth = ARRAY[]::jsonb[];
  `;
  await client.query(updateQuery);
  client.release();
};
