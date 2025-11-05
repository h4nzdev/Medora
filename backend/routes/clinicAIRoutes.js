import express from "express";
import {
  clinicAIChat,
  getClinicAnalytics,
} from "../controller/clinicAIController.js";
import { authenticate, requireClinic } from "../middleware/authMiddleware.js";

// Create a uniquely named router
const clinicAIRouter = express.Router();

// 🔒 ALL ROUTES REQUIRE CLINIC AUTHENTICATION

// Main clinic AI chat endpoint
clinicAIRouter.post("/chat", authenticate, requireClinic, clinicAIChat);

// Get clinic analytics data for AI context
clinicAIRouter.get(
  "/analytics",
  authenticate,
  requireClinic,
  getClinicAnalytics
);

// Test route to verify clinic AI is working
clinicAIRouter.get("/test", authenticate, requireClinic, (req, res) => {
  res.json({
    message: "Clinic AI is working! 🏥",
    clinic: req.session.user.clinicName,
    role: "Clinic AI Assistant",
  });
});

export default clinicAIRouter;
