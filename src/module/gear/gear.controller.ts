import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import AppError from "../../errors/AppError";

import { GearService } from "./gear.service";

const createGear = catchAsync(async (req, res) => {
  const {
    title,
    description,
    brand,
    image,
    pricePerDay,
    stock,
    categoryId,
  } = req.body;

  if (
    !title ||
    !description ||
    !brand ||
    !image ||
    pricePerDay === undefined ||
    stock === undefined ||
    !categoryId
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "All fields are required.",
    );
  }

  const result = await GearService.createGear(
    req.user!.userId,
    {
      title,
      description,
      brand,
      image,
      pricePerDay: Number(pricePerDay),
      stock: Number(stock),
      categoryId,
    },
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Gear created successfully.",
    data: result,
  });
});

const getAllGear = catchAsync(async (req, res) => {
  const result = await GearService.getAllGear({
    search:
      typeof req.query.search === "string"
        ? req.query.search
        : undefined,

    category:
      typeof req.query.category === "string"
        ? req.query.category
        : undefined,

    brand:
      typeof req.query.brand === "string"
        ? req.query.brand
        : undefined,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gear retrieved successfully.",
    data: result,
  });
});

const getGearById = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Gear id is required.",
    );
  }

  const result =
    await GearService.getGearById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gear retrieved successfully.",
    data: result,
  });
});

export const GearController = {
  createGear,
  getAllGear,
  getGearById,
};