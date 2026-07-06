import { Role } from "../../generated/prisma/client";

export interface JwtPayload {
  userId: string;
  role: Role;
}