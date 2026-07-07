import { Router } from "express";

import { CategoryController } from "./category.controller";

import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorize";

import { Role } from "../../../generated/prisma/client";

const router = Router();

router.get(
  "/",
  CategoryController.getAllCategories,
);

router.get(
  "/:id",
  CategoryController.getCategoryById,
);

router.post(
  "/",
  auth,
  authorize(Role.ADMIN),
  CategoryController.createCategory,
);

export default router;