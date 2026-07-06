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

export const AuthController = {
  register,
  login,
};