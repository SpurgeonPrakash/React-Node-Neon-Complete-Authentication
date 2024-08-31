import express from "express";
import cookieParser from "cookie-parser";
import { cors } from "./cors/cors.js";

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors);

// app.use("/api/v1", apiRoutes);
