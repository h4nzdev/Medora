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
feedbackRouter.get("/", authenticate, requireAdmin, getAllFeedback);
feedbackRouter.get(
  "/type/:type",
  authenticate,
  requireAdmin,
  getFeedbackByType
);
feedbackRouter.post(
  "/:id/response",
  authenticate,
  requireAdmin,
  addAdminResponse
);
feedbackRouter.post(
  "/:id/reaction",
  authenticate,
  requireAdmin,
  addAdminReaction
);
feedbackRouter.patch(
  "/:id/status",
  authenticate,
  requireAdmin,
  updateFeedbackStatus
);
feedbackRouter.delete("/:id", authenticate, requireAdmin, deleteFeedback);
feedbackRouter.get("/my-feedback", authenticate, getMyFeedback);

export default feedbackRouter;
