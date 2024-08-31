import jwt from "jsonwebtoken";
import CustomError from "../../utils/CustomError.js";
import { ACCESS_TOKEN_NAME, ACCESS_TOKEN_SECRET } from "../../config/index.js";

export const isAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.cookies[ACCESS_TOKEN_NAME];

    if (!token) {
      const error = new CustomError("Not authenticated", 401);
      throw error;
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

    if (!decodedToken) {
      const error = new CustomError("Not authenticated", 401);
      throw error;
    }

    //    console.log("DECODED_TOKEN", decodedToken);

    req.id = decodedToken.id;
    req.email = decodedToken.email;
    next();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 403;
    }
    return next(err);
  }
};
