import express from "express";
import {
  loginClinic,
  clinicRegister,
  sendVerification,
  verifyAndChangeClinicPassword,
  updateClinicPassword,
  sendClinicPasswordChangeVerification,
} from "../controller/clinicAuthController.js";
import upload from "../middleware/multerConfig.js";

const clinicAuthRoutes = express.Router();

clinicAuthRoutes.post("/login", loginClinic);
clinicAuthRoutes.post(
  "/register",
  upload.single("clinicPicture"),
  clinicRegister
);
clinicAuthRoutes.post("/send-verification", sendVerification);

// 👇 NEW PASSWORD ROUTES
clinicAuthRoutes.post(
  "/send-password-verification",
  sendClinicPasswordChangeVerification
);
clinicAuthRoutes.post("/verify-change-password", verifyAndChangeClinicPassword);
clinicAuthRoutes.patch("/update-password/:clinicId", updateClinicPassword);

export default clinicAuthRoutes;
