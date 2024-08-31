import { Request, Response, NextFunction } from "express";
import { CORS_ALLOW_ORIGIN } from "../config/index.js";

const CORS = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = CORS_ALLOW_ORIGIN.join(",");
  const origin = req.headers.origin as string;
  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else {
    res.setHeader("Access-Control-Allow-Origin", ""); // Block origin if not allowed
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    // "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    "OPTIONS, GET, POST, PUT, DELETE",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length",
  );
  res.setHeader("Access-Control-Max-Age", "86400");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
  } else {
    next();
  }
};

export const cors = CORS;
