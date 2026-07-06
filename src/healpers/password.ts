import bcrypt from "bcryptjs";
import config from "../config";

const saltRounds = Number(config.bcrypt_salt_rounds);

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};