import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import config from "../config";
import { verifyToken } from "../helpers/jwt";
import { JwtPayload } from "../interfaces/jwt.interface";

const auth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Authorization token is missing.",
      errorDetails: null,
    });
  }

  let token: string;

  if (authHeader.startsWith("Bearer ")) {
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || !parts[1]) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Invalid authorization header format.",
        errorDetails: null,
      });
    }

    token = parts[1];
  } else {
    token = authHeader;
  }

  try {
    const decoded = verifyToken<JwtPayload>(
      token,
      config.jwt_access_secret,
    );

    req.user = decoded;

    next();
  } catch {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Invalid or expired token.",
      errorDetails: null,
    });
  }
};

export default auth;