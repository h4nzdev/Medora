import express from "express";
import {
  createNotification,
  deleteAllNotifications,
  deleteNotification,
  getUserNotifications,
  markAllAsRead,
  markAsRead,
  getSystemNotifications,
} from "../controller/notificationController.js";

const notificationRouter = express.Router();

// Create a new notification
notificationRouter.post("/add-notification", createNotification);

// Get notifications for a specific user (includes system-wide notifications)
notificationRouter.get("/:recipientId/:recipientType", getUserNotifications);

// Get system-wide notifications (admin view)
notificationRouter.get("/system/all", getSystemNotifications);

// Mark a single notification as read
notificationRouter.patch("/:id/read", markAsRead);

// Mark all notifications as read for a user
notificationRouter.put("/mark-all-read", markAllAsRead);

// Delete a single notification
notificationRouter.delete("/:id", deleteNotification);

// Delete all notifications for a user
notificationRouter.delete("/user/all", deleteAllNotifications);

export default notificationRouter;
