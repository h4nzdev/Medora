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
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";

const feedbackRouter = express.Router();

// 🛣️ Public/User Routes (no admin required)
feedbackRouter.post("/", submitFeedback);

// 🛣️ Admin Only Routes (all require admin privileges)
feedbackRouter.get(
  "/",
  authenticate,
  requireAdmin,
  (req, res, next) => {
    console.log("🔐 Feedback route - User:", req.user); // ADD THIS
    next();
  },
  getAllFeedback
);

feedbackRouter.get("/type/:type", requireAdmin, getFeedbackByType);
feedbackRouter.post("/:id/response", requireAdmin, addAdminResponse);
feedbackRouter.post("/:id/reaction", requireAdmin, addAdminReaction);
feedbackRouter.patch("/:id/status", requireAdmin, updateFeedbackStatus);
feedbackRouter.delete("/:id", requireAdmin, deleteFeedback);
feedbackRouter.get("/my-feedback", authenticate, getMyFeedback);

export default feedbackRouter;
