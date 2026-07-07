import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const register = async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully.",
    data: result,
  });
};

const login = async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  res.status(200).json({
    success: true,
    message: "User logged in successfully.",
    data: result,
  });
};

const getMyProfile = async (
  req: Request,
  res: Response,
) => {

  const result = await AuthService.getMyProfile(
    req.user!.userId,
  );

  res.status(200).json({
    success: true,
    message: "Profile retrieved successfully.",
    data: result,
  });

};

const updateMyProfile = async (
  req: Request,
  res: Response,
) => {
  const { name, phone, photo } = req.body;

  if (
    name === undefined &&
    phone === undefined &&
    photo === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: "No data provided for update.",
      errorDetails: null,
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

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: result,
  });
};

export const AuthController = {
  register,
  login,
  getMyProfile,
  updateMyProfile,
};