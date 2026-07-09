import { Router } from "express";

import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorize";

import { Role } from "../../../generated/prisma/client";

import { AdminController } from "./admin.controller";

const router = Router();

router.get(
  "/users",
  auth,
  authorize(Role.ADMIN),
  AdminController.getAllUsers,
);

router.patch(
  "/users/:id",
  auth,
  authorize(Role.ADMIN),
  AdminController.updateUserStatus,
);

router.get(
  "/gear",
  auth,
  authorize(Role.ADMIN),
  AdminController.getAllGear,
);

router.get(
  "/rentals",
  auth,
  authorize(Role.ADMIN),
  AdminController.getAllRentals,
);

export default router;