import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: function () {
      // Only require recipientId if recipientType is not "all"
      return this.recipientType !== "all";
    },
  },
  recipientType: {
    type: String,
    enum: ["Client", "Clinic", "Admin", "all"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  systemMessage: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ["appointment", "payment", "system", "other"],
    default: "system",
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
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
