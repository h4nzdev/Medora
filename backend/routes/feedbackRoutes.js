import express from "express";
import {
  submitFeedback,
  getAllFeedback,
  getFeedbackByType,
  deleteFeedback,
} from "../controller/feedbackController.js";

const feedbackRouter = express.Router();

// 🛣️ Feedback Routes
feedbackRouter.post("/", submitFeedback); // POST /api/feedback
feedbackRouter.get("/", getAllFeedback); // GET /api/feedback
feedbackRouter.get("/:type", getFeedbackByType); // GET /api/feedback/bug
feedbackRouter.delete("/:id", deleteFeedback); // DELETE /api/feedback/123

export default feedbackRouter;
