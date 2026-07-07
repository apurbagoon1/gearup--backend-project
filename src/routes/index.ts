import { Router } from "express";
import authRoutes from "../module/auth/auth.route"
import categoryRoutes from "../module/category/category.route"

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);

export default router;