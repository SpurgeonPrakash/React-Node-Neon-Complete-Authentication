import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import CustomError from "../../utils/CustomError.js";
import { ACCESS_TOKEN_NAME, ACCESS_TOKEN_SECRET } from "../../config/index.js";

interface JwtUserPayload extends JwtPayload {
  id: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  loginplatform?: string;
  isverified?: boolean;
  created_at?: string;
}

const isJwtUserPayload = (
  decoded: string | JwtPayload | null,
): decoded is JwtUserPayload => {
  return (
    decoded !== null &&
    typeof decoded === "object" &&
    typeof decoded.id === "string"
  );
};

const verifyJwtAsUserPayload = (
  token: string,
  secret: string,
): JwtUserPayload => {
  const decoded = jwt.verify(token, secret);

  if (!isJwtUserPayload(decoded)) {
    throw new CustomError("Invalid token payload", 401);
  }

  return decoded;
};

export const isAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.cookies?.[ACCESS_TOKEN_NAME];

    if (!token) {
      throw new CustomError("Not authenticated", 401);
    }

    const decodedToken = verifyJwtAsUserPayload(token, ACCESS_TOKEN_SECRET);

    req.id = decodedToken.id;
    req.email = decodedToken.email;

    return next();
  } catch (err) {
    const error = err as CustomError & {
      statusCode?: number;
    };

    if (!error.statusCode) {
      error.statusCode = 403;
    }

    return next(error);
  }
};
