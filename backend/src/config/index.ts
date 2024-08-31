import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT!;
export const NODE_ENV = process.env.NODE_ENV!;

export const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL!;

export const CORS_ALLOW_ORIGIN = [FRONTEND_BASE_URL];

export const PGHOST = process.env.PGHOST!;
export const PGDATABASE = process.env.PGDATABASE!;
export const PGUSER = process.env.PGUSER!;
export const PGPASSWORD = process.env.PGPASSWORD!;
export const ENDPOINT_ID = process.env.ENDPOINT_ID!;

export const JWT_ACCOUNT_ACTIVATION = process.env.JWT_ACCOUNT_ACTIVATION!;
export const ACCESS_TOKEN_NAME = "access_token";
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
export const ACCESS_TOKEN_EXPIRY = 1000 * 60 * 2 - 1000 * 60;
export const REFRESH_TOKEN_NAME = "refresh_token";
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
export const REFRESH_TOKEN_EXPIRY = 1000 * 60 * 10;
export const FORGET_PASSWORD_SECRET = process.env.FORGET_PASSWORD_SECRET!;

export const MAIL_FROM = process.env.MAIL_FROM!;
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
export const GOOGLE_CLIENT_REDIRECT_URL =
  process.env.GOOGLE_CLIENT_REDIRECT_URL!;

export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID!;
export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET!;
export const FACEBOOK_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI!;

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
export const GITHUB_REDIRECT_URL = process.env.GITHUB_REDIRECT_URL!;

export const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID!;
export const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET!;
export const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI!;
