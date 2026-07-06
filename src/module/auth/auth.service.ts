import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { hashPassword, comparePassword } from "../../helpers/password";
import { generateToken } from "../../helpers/jwt";
import config from "../../config";
import { SignOptions } from "jsonwebtoken";

const register = async (payload: any) => {
  const { name, email, password, role, phone, photo } = payload;

  if (!name || !email || !password || !role) {
    throw new Error("Name, email, password and role are required.");
  }

  const isUserExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExists) {
    throw new Error("Email already exists.");
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
    throw new Error("Email and password are required.");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials.");
  }

  const isPasswordMatched = await comparePassword(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Invalid credentials.");
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

export const AuthService = {
  register,
  login,
};
