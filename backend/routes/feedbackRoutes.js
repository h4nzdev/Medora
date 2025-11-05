import express from "express";
import {
  submitFeedback,
  getAllFeedback,
  getFeedbackByType,
  deleteFeedback,
  addAdminResponse,
  addAdminReaction,
  updateFeedbackStatus,
  getMyFeedback,
} from "../controller/feedbackController.js";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js"; // ADD THIS IMPORT

const feedbackRouter = express.Router();

// 🛣️ Public/User Routes (no admin required)
feedbackRouter.post("/", submitFeedback); // POST /api/feedback
feedbackRouter.get("/my-feedback", authenticate, getMyFeedback); // ADDED: authenticate middleware

// 🛣️ Admin Only Routes (all require admin privileges)
feedbackRouter.get("/", requireAdmin, getAllFeedback); // ADDED: requireAdmin middleware
feedbackRouter.get("/type/:type", requireAdmin, getFeedbackByType); // ADDED: requireAdmin middleware
feedbackRouter.post("/:id/response", requireAdmin, addAdminResponse); // ADDED: requireAdmin middleware
feedbackRouter.post("/:id/reaction", requireAdmin, addAdminReaction); // ADDED: requireAdmin middleware
feedbackRouter.patch("/:id/status", requireAdmin, updateFeedbackStatus); // ADDED: requireAdmin middleware
feedbackRouter.delete("/:id", requireAdmin, deleteFeedback); // ADDED: requireAdmin middleware

export default feedbackRouter;
