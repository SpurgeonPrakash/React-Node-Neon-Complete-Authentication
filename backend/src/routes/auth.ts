import express from "express";
import {
  facebookLogin,
  facebookRedirect,
  forgetPassword,
  githubLogin,
  githubRedirect,
  googleLogin,
  googleRedirect,
  linkedinLogin,
  linkedinRedirect,
  logOut,
  me,
  refreshAccessToken,
  resetPassword,
  signin,
  signup,
  verifyAccount,
} from "../controllers/auth.js";
import { isAuth } from "../middlewares/auth/isAuth.js";

export const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/verify-account", verifyAccount);
authRoutes.post("/signin", signin);
authRoutes.get("/refresh", refreshAccessToken);
authRoutes.post("/logout", logOut);

authRoutes.get("/me", isAuth, me);

authRoutes.get("/redirect/google-oauth", googleRedirect);
authRoutes.get("/redirect/facebook-oauth", facebookRedirect);
authRoutes.get("/redirect/github-oauth", githubRedirect);
authRoutes.get("/redirect/linkedin-oauth", linkedinRedirect);

authRoutes.get("/google-oauth", googleLogin);
authRoutes.get("/facebook-oauth", facebookLogin);
authRoutes.get("/github-oauth", githubLogin);
authRoutes.get("/linkedin-oauth", linkedinLogin);

authRoutes.post("/forget-password", forgetPassword);
authRoutes.post("/reset-password", resetPassword);
