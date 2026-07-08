import httpStatus from "http-status";

import AppError from "../../errors/AppError";

import { RentalService } from "./rental.service";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createRental = catchAsync(async (req, res) => {
  const { gearId, startDate, endDate, quantity } = req.body;

  if (
    !gearId ||
    !startDate ||
    !endDate ||
    quantity === undefined
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "All fields are required.",
    );
  }

  const result = await RentalService.createRental(
    req.user!.userId,
    {
      gearId,
      startDate,
      endDate,
      quantity,
    },
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Rental created successfully.",
    data: result,
  });
});

const getMyRentals = catchAsync(async (req, res) => {
  const result =
    await RentalService.getMyRentals(
      req.user!.userId,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rentals retrieved successfully.",
    data: result,
  });
});

const getRentalById = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rental id is required.",
    );
  }

  const result =
    await RentalService.getRentalById(
      req.user!.userId,
      id,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental retrieved successfully.",
    data: result,
  });
});

export const RentalController = {
  createRental,
  getMyRentals,
  getRentalById,
};