import type { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/apiError.js";
import { ZodError } from "zod";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  // Handle Zod validation error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errors = err.issues.map((e: any) => ({
      path: e.path.join("."),
      message: e.message,
    }));
  }

  // Handle specific ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }

  // Handle Prisma unique constraint errors etc. (optional but good)
  if (err.code === "P2002") {
    statusCode = 409;
    message = "Duplicate field value entered";
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorMiddleware;
