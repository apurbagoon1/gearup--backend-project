import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const register = catchAsync(async (req, res) => {
  const result = await AuthService.register(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Registration successful.",
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const result = await AuthService.login(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful.",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const result = await AuthService.getMyProfile(
    req.user!.userId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile retrieved successfully.",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const { name, phone, photo } = req.body;

  if (
    name === undefined &&
    phone === undefined &&
    photo === undefined
  ) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "No data provided for update.",
      data: null,
    });
  }

  const payload = {
    name,
    phone,
    photo,
  };

  const result = await AuthService.updateMyProfile(
    req.user!.userId,
    payload,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully.",
    data: result,
  });
});

export const AuthController = {
  register,
  login,
  getMyProfile,
  updateMyProfile,
};