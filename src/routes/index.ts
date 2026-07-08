import { Router } from "express";
import authRoutes from "../module/auth/auth.route"
import categoryRoutes from "../module/category/category.route"
import gearRoutes from "../module/gear/gear.route";
import rentalRoutes from "../module/rental/rental.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/gear", gearRoutes);
router.use("/rentals", rentalRoutes);

export default router;