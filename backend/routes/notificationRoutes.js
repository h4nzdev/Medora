import express from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
} from "../controller/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.post("/add-notification", createNotification);
notificationRouter.get("/:recipientId/:recipientType", getUserNotifications);
notificationRouter.patch("/:id/read", markAsRead);

export default notificationRouter;
