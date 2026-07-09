import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { ProviderService } from "./provider.service";

import AppError from "../../errors/AppError";
import { RentalStatus } from "../../../generated/prisma/client";

const getDashboard = catchAsync(async (req, res) => {
  const result = await ProviderService.getDashboard(req.user!.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,

    success: true,

    message: "Dashboard retrieved successfully.",

    data: result,
  });
});

const getIncomingOrders = catchAsync(async (req, res) => {
  const { status } = req.query;

  if (
    status &&
    (typeof status !== "string" ||
      !Object.values(RentalStatus).includes(status as RentalStatus))
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid rental status.");
  }

  const result = await ProviderService.getIncomingOrders(req.user!.userId, {
    status: status as string | undefined,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,

    success: true,

    message: "Incoming orders retrieved successfully.",

    data: result,
  });
});

export const ProviderController = {
  getDashboard,
  getIncomingOrders,
};
