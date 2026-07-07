import { Router } from "express";

import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorize";

import { Role } from "../../../generated/prisma/client";

import { GearController } from "./gear.controller";

const router = Router();

router.post(
  "/",
  auth,
  authorize(Role.PROVIDER),
  GearController.createGear,
);

router.get(
  "/",
  GearController.getAllGear,
);

router.get(
  "/:id",
  GearController.getGearById,
);

router.patch(
  "/:id",
  auth,
  authorize(Role.PROVIDER),
  GearController.updateGear,
);

export default router;