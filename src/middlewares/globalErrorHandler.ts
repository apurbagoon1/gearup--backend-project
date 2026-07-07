import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";

import AppError from "../errors/AppError";

import { Prisma } from "../../generated/prisma/client";
import jwt from "jsonwebtoken";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong.";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Database operation failed.";
  } else if (err instanceof jwt.JsonWebTokenError) {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Invalid token.";
  } else if (err instanceof jwt.TokenExpiredError) {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Token has expired.";
  } else if (err instanceof Error) {
    message = err.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorDetails: process.env.NODE_ENV === "development" ? err : null,
  });
};

export default globalErrorHandler;
