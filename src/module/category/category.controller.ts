import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CategoryService } from "./category.service";

import AppError from "../../errors/AppError";

const createCategory = catchAsync(async (req, res) => {
  const { name, description } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category name is required.");
  }

  const result = await CategoryService.createCategory({
    name,
    description,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully.",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategories();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories retrieved successfully.",
    data: result,
  });
});

const getCategoryById = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    throw new AppError(httpStatus.BAD_REQUEST, "Category id is required.");
  }

  const result = await CategoryService.getCategoryById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category retrieved successfully.",
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Category id is required.",
    );
  }

  const { name, description } = req.body;

  if (
    name === undefined &&
    description === undefined
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No data provided for update.",
    );
  }

  const result =
    await CategoryService.updateCategory(id, {
      name,
      description,
    });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully.",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Category id is required.",
    );
  }

  await CategoryService.deleteCategory(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully.",
    data: null,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
