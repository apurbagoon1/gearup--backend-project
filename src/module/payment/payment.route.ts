import { Router } from "express";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorize";
import { Role } from "../../../generated/prisma/client";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create",
  auth,
  authorize(Role.CUSTOMER),
  PaymentController.createPaymentIntent,
);

export default router;