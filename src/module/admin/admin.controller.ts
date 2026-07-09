import httpStatus from "http-status";

import AppError from "../../errors/AppError";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { RentalStatus, UserStatus } from "../../../generated/prisma/client";

import { AdminService } from "./admin.service";

const getAllUsers = catchAsync(async (req, res) => {
  const result = await AdminService.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully.",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    throw new AppError(httpStatus.BAD_REQUEST, "User id is required.");
  }

  const { status } = req.body;

  if (!Object.values(UserStatus).includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user status.");
  }

  const result = await AdminService.updateUserStatus(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully.",
    data: result,
  });
});

const getAllGear = catchAsync(async (req, res) => {
  const result = await AdminService.getAllGear(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,

    success: true,

    message: "Gear retrieved successfully.",

    data: result,
  });
});

const getAllRentals = catchAsync(async (req, res) => {
  const { status } = req.query;

  if (
    status &&
    (typeof status !== "string" ||
      !Object.values(RentalStatus).includes(status as RentalStatus))
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid rental status.");
  }

  const result = await AdminService.getAllRentals({
    page: req.query.page as string,
    limit: req.query.limit as string,
    status: status as string,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,

    success: true,

    message: "Rentals retrieved successfully.",

    data: result,
  });
});

export const AdminController = {
  getAllUsers,
  updateUserStatus,
  getAllGear,
  getAllRentals,
};
