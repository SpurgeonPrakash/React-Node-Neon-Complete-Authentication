import express from "express";
import { authRoutes } from "./auth.js";
const app = express();

app.use("/auth", authRoutes);

export const apiRoutes = app;
