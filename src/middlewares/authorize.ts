import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Role, UserStatus } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

const authorize =
  (...roles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized access.",
        errorDetails: null,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
    });

    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "User not found.",
        errorDetails: null,
      });
    }

    if (user.status === UserStatus.SUSPENDED) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: "Your account has been suspended.",
        errorDetails: null,
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: "Forbidden access.",
        errorDetails: null,
      });
    }

    next();
  };

export default authorize;