// routes/forgotPasswordRoutes.js
import express from "express";
import {
  requestPasswordReset,
  verifyAndResetPassword,
} from "../controller/forgotPasswordController.js";

const forgotPasswordRouter = express.Router();

forgotPasswordRouter.post("/request-reset", requestPasswordReset);
forgotPasswordRouter.post("/verify-reset", verifyAndResetPassword);

export default forgotPasswordRouter;
