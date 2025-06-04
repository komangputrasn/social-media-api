import connection from "@/helpers/db";
import { NextFunction, Request, Response } from "express";

const root = async (req: Request, res: Response) => {
  const queryResult = await connection.query("SELECT * FROM account");
  console.log("Results: ", queryResult);
  res.json({
    message: "Welcome to Social Media API!",
    timestamp: new Date().toISOString(),
  });
};

const healthCheck = (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
};

const internalServerError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
};

export default {
  root,
  healthCheck,
  notFound,
  internalServerError,
};
