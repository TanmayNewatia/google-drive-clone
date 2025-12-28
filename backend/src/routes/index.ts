import express from "express";
import authRoutes from "./auth";
import fileRoutes from "./files";

const router = express.Router();

// Mount route modules
router.use("/auth", authRoutes);
router.use("/files", fileRoutes);

export default router;
