import express from "express";
import {
  createSystemUpdate,
  getAllSystemUpdates,
  getSystemUpdateById,
  updateSystemUpdate,
  deleteSystemUpdate,
  publishSystemUpdate,
} from "../controller/systemmUpdatesController.js";

const systemUpdatesRouter = express.Router();

// Create a new system update
systemUpdatesRouter.post("/", createSystemUpdate);

// Get all system updates
systemUpdatesRouter.get("/", getAllSystemUpdates);

// Get a specific system update by ID
systemUpdatesRouter.get("/:id", getSystemUpdateById);

// Update a system update
systemUpdatesRouter.put("/:id", updateSystemUpdate);

// Delete a system update
systemUpdatesRouter.delete("/:id", deleteSystemUpdate);

// Publish a system update
systemUpdatesRouter.patch("/:id/publish", publishSystemUpdate);

export default systemUpdatesRouter;
