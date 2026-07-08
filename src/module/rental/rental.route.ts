import { Router } from "express";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorize";
import { Role } from "../../../generated/prisma/client";
import { RentalController } from "./rental.controller";

const router = Router();

router.post(
  "/",
  auth,
  authorize(Role.CUSTOMER),
  RentalController.createRental,
);

router.get(
  "/",
  auth,
  authorize(Role.CUSTOMER),
  RentalController.getMyRentals,
);

router.get(
  "/:id",
  auth,
  authorize(Role.CUSTOMER),
  RentalController.getRentalById,
);

router.patch(
  "/:id/status",
  auth,
  authorize(Role.PROVIDER),
  RentalController.updateRentalStatus,
);

export default router;