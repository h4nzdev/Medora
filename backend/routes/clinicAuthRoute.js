import express from "express";
import {
  loginClinic,
  clinicRegister,
  sendVerification,
} from "../controller/clinicAuthController.js";

const clinicAuthRoutes = express.Router();

clinicAuthRoutes.post("/login", loginClinic);
clinicAuthRoutes.post("/register", clinicRegister);
clinicAuthRoutes.post("/send-verification", sendVerification);

export default clinicAuthRoutes;
