import express from "express";
import {
  loginAdmin,
  createAdmin,
  updateAdminPassword,
  getAdmins,
  deleteAdmin,
  logoutAdmin, // ADD THIS IMPORT
} from "../controller/adminController.js";
import { requireAdmin } from "../middleware/authMiddleware.js"; // ADD THIS IMPORT

const adminRouter = express.Router();

// Public admin routes (no authentication needed)
adminRouter.post("/login", loginAdmin);
adminRouter.post("/create", createAdmin); // You might want to protect this later

// Protected admin routes (require admin authentication)
adminRouter.post("/logout", requireAdmin, logoutAdmin); // ADDED: requireAdmin middleware
adminRouter.get("/", requireAdmin, getAdmins); // ADDED: requireAdmin middleware
adminRouter.put("/:adminId/password", requireAdmin, updateAdminPassword); // ADDED: requireAdmin middleware
adminRouter.delete("/:adminId", requireAdmin, deleteAdmin); // ADDED: requireAdmin middleware

export default adminRouter;
