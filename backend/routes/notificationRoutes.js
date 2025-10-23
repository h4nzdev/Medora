import express from "express";
import {
  createNotification,
  deleteAllNotifications,
  deleteNotification,
  getUserNotifications,
  markAllAsRead,
  markAsRead,
} from "../controller/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.post("/add-notification", createNotification);
notificationRouter.get("/:recipientId/:recipientType", getUserNotifications);
notificationRouter.patch("/:id/read", markAsRead);
notificationRouter.delete("/:id", deleteNotification);
notificationRouter.delete("/user/all", deleteAllNotifications);
notificationRouter.put("/mark-all-read", markAllAsRead);

export default notificationRouter;
