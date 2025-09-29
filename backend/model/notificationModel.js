import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  recipientType: {
    type: String,
    enum: ["Client", "Clinic"], // who receives it
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["appointment", "payment", "system", "other"],
    default: "system",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model(
  "Notifications",
  notificationSchema,
  "notifications"
);

export default Notification;
