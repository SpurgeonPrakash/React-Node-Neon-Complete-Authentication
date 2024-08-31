import { NextFunction, Request, Response } from "express";
import { NODE_ENV, PORT } from "./config/index.js";
import { app } from "./index.js";
import CustomError from "./utils/CustomError.js";
import { apiRoutes } from "./routes/api.js";
import { initializeDb } from "./db/initializeDB.js";

initializeDb();

app.use("/api/v1", apiRoutes);

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  const { statusCode } = err;
  const { message } = err;
  // const data = err.data;
  return res.status(statusCode || 500).json({
    message: message || "An unknown error occurred!",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}, in ${NODE_ENV} MODE.`);
});
