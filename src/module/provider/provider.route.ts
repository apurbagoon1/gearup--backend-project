import { Router } from "express";

import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorize";

import { Role } from "../../../generated/prisma/client";

import { ProviderController } from "./provider.controller";

const router = Router();

router.get(
  "/dashboard",
  auth,
  authorize(Role.PROVIDER),
  ProviderController.getDashboard,
);

router.get(
  "/orders",
  auth,
  authorize(Role.PROVIDER),
  ProviderController.getIncomingOrders,
);

export default router;