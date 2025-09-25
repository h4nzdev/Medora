import express from "express";
import {
  loginClinic,
  clinicRegister,
  sendVerification,
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

export default clinicAuthRoutes;
