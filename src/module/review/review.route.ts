import { Router } from "express";

import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorize";

import { Role } from "../../../generated/prisma/client";

import { ReviewController } from "./review.controller";

const router = Router();

router.post(
  "/",
  auth,
  authorize(Role.CUSTOMER),
  ReviewController.createReview,
);

export default router;