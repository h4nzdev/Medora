import express from "express";
import {
  loginAdmin,
  createAdmin,
  updateAdminPassword,
  getAdmins,
  deleteAdmin,
} from "../controller/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/create", createAdmin);
adminRouter.put("/:adminId/password", updateAdminPassword);
adminRouter.get("/", getAdmins);
adminRouter.delete("/:adminId", deleteAdmin);

export default adminRouter;
