import express from "express";
import {
  loginClient,
  registerClient,
  sendVerification,
} from "../controller/patientAuthController.js";

const patientAuthRouter = express.Router();

// 🟢 Patient login route
patientAuthRouter.post("/login", loginClient);
patientAuthRouter.post("/register", registerClient);
patientAuthRouter.post("/send-verification", sendVerification);

export default patientAuthRouter;
