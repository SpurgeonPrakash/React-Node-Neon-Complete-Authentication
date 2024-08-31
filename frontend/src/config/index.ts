const accessTokenExpiry = 1000 * 60 * 2;
const refreshingTokenTime = accessTokenExpiry - 1000 * 60;

const refreshTokenExpiry = 1000 * 60 * 10;

export const NAV_HEIGHT = "40px";

export const VITE_BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL!;

export const ACCESS_TOKEN_EXPIRY_MINUS_ONE_MINUTE = refreshingTokenTime;
export const LOCAL_REFRESH_EXPIRY_NAME = "logOutTime";
export const REFRESH_TOKEN_EXPIRY_MINUS_ONE_MINUTE =
  refreshTokenExpiry - 1000 * 60;
export const LOGOUT_PENDING_KEY = "isLogoutPending";

export const PROTECTED_ROUTES: string[] = [];
export const PUBLIC_ROUTES: string[] = [
  "/",
  "/signin",
  "/signup",
  "/activate-account/:token",
];

export const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID!;
export const VITE_GOOGLE_CLIENT_SECRET = import.meta.env
  .VITE_GOOGLE_CLIENT_SECRET!;
export const VITE_GOOGLE_CLIENT_REDIRECT_URL = import.meta.env
  .VITE_GOOGLE_CLIENT_REDIRECT_URL!;

export const VITE_FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID!;
export const VITE_FACEBOOK_APP_SECRET = import.meta.env
  .VITE_FACEBOOK_APP_SECRET!;
export const VITE_FACEBOOK_REDIRECT_URI = import.meta.env
  .VITE_FACEBOOK_REDIRECT_URI!;

export const VITE_GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID!;
export const VITE_GITHUB_CLIENT_SECRET = import.meta.env
  .VITE_GITHUB_CLIENT_SECRET!;
export const VITE_GITHUB_REDIRECT_URL = import.meta.env
  .VITE_GITHUB_REDIRECT_URL!;

export const VITE_LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID!;
export const VITE_LINKEDIN_CLIENT_SECRET = import.meta.env
  .VITE_LINKEDIN_CLIENT_SECRET!;
export const VITE_LINKEDIN_REDIRECT_URI = import.meta.env
  .VITE_LINKEDIN_REDIRECT_URI!;
