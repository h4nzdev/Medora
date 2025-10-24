import express from "express";
import {
  loginClient,
  registerClient,
  sendPasswordChangeVerification,
  sendVerification,
  verifyAndChangePassword,
} from "../controller/patientAuthController.js";
import upload from "../middleware/multerConfig.js";

const patientAuthRouter = express.Router();

// 🟢 Patient login route
patientAuthRouter.post("/login", loginClient);
patientAuthRouter.post(
  "/register",
  upload.single("patientPicture"),
  registerClient
);
patientAuthRouter.post("/send-verification", sendVerification);
patientAuthRouter.post(
  "/send-password-verification",
  sendPasswordChangeVerification
);
patientAuthRouter.post("/verify-change-password", verifyAndChangePassword);

export default patientAuthRouter;
