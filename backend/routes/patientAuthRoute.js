import express from "express";
import {
  loginClient,
  registerClient,
  sendPasswordChangeVerification,
  sendVerification,
  verifyAndChangePassword,
  logoutPatient, // ADD THIS IMPORT
} from "../controller/patientAuthController.js";
import upload from "../middleware/multerConfig.js";
import { authenticate, requirePatient } from "../middleware/authMiddleware.js"; // ADD THIS IMPORT

const patientAuthRouter = express.Router();

// 🟢 Public Patient Routes (no authentication needed)
patientAuthRouter.post("/login", loginClient);
patientAuthRouter.post(
  "/register",
  upload.single("patientPicture"),
  registerClient
);
patientAuthRouter.post("/send-verification", sendVerification);

// 🟢 Protected Patient Routes (require patient authentication)
patientAuthRouter.post("/logout", authenticate, logoutPatient); // ADDED: authenticate middleware
patientAuthRouter.post(
  "/send-password-verification",
  sendPasswordChangeVerification
);
patientAuthRouter.post("/verify-change-password", verifyAndChangePassword);

export default patientAuthRouter;
