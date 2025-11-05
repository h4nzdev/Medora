import express from "express";
import {
  loginClinic,
  clinicRegister,
  sendVerification,
  verifyAndChangeClinicPassword,
  updateClinicPassword,
  sendClinicPasswordChangeVerification,
  logoutClinic, // ADD THIS IMPORT
} from "../controller/clinicAuthController.js";
import upload from "../middleware/multerConfig.js";
import { authenticate, requireClinic } from "../middleware/authMiddleware.js"; // ADD THIS IMPORT

const clinicAuthRoutes = express.Router();

// 🟢 Public Clinic Routes (no authentication needed)
clinicAuthRoutes.post("/login", loginClinic);
clinicAuthRoutes.post(
  "/register",
  upload.single("clinicPicture"),
  clinicRegister
);
clinicAuthRoutes.post("/send-verification", sendVerification);

// 🟢 Protected Clinic Routes (require clinic authentication)
clinicAuthRoutes.post("/logout", authenticate, logoutClinic);
clinicAuthRoutes.post(
  "/send-password-verification",
  authenticate,
  sendClinicPasswordChangeVerification
);
clinicAuthRoutes.post(
  "/verify-change-password",
  authenticate,
  verifyAndChangeClinicPassword
);
clinicAuthRoutes.patch(
  "/update-password/:clinicId",
  requireClinic,
  updateClinicPassword
);

export default clinicAuthRoutes;
