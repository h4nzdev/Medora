// routes/subscriptionRoutes.js
import express from "express";
import {
  createSubscription,
  getClinicSubscription,
  updateSubscription,
  getAllSubscriptions,
} from "../controller/subscriptionController.js";

const subscriptionRouter = express.Router();

// Create new subscription
subscriptionRouter.post("/", createSubscription);

// Get current active subscription for a clinic
subscriptionRouter.get("/clinic/:clinicId", getClinicSubscription);

// Update subscription status
subscriptionRouter.put("/:id", updateSubscription);

// Get all subscriptions (for admin)
subscriptionRouter.get("/", getAllSubscriptions);

export default subscriptionRouter;
