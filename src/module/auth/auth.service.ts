import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { hashPassword, comparePassword } from "../../helpers/password";
import { generateToken } from "../../helpers/jwt";
import config from "../../config";
import { SignOptions } from "jsonwebtoken";
import AppError from "../../errors/AppError";

const register = async (payload: any) => {
  const { name, email, password, role, phone, photo } = payload;

  if (!name || !email || !password || !role) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Name, email, password and role are required.",
    );
  }

  const isUserExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExists) {
    throw new AppError(httpStatus.CONFLICT, "Email already exists.");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      photo,
    },
  });

  const accessToken = generateToken(
    {
      userId: user.id,
      role: user.role,
    },
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions["expiresIn"],
  );

  return {
    token: accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const login = async (payload: any) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Email and password are required.",
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials.");
  }

  const isPasswordMatched = await comparePassword(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials.");
  }

  const accessToken = generateToken(
    {
      userId: user.id,
      role: user.role,
    },
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions["expiresIn"],
  );

  return {
    token: accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      photo: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const updateMyProfile = async (
  userId: string,
  payload: {
    name?: string;
    phone?: string;
    photo?: string;
  },
) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      photo: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

export const AuthService = {
  register,
  login,
  getMyProfile,
  updateMyProfile,
};
