import Notification from "../model/notificationModel.js";

// ✅ Create a new notification
export const createNotification = async (req, res) => {
  try {
    const { recipientId, recipientType, message, type } = req.body;

    const notification = await Notification.create({
      recipientId,
      recipientType,
      message,
      type,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error });
  }
};

// ✅ Get all notifications for a specific user
export const getUserNotifications = async (req, res) => {
  try {
    const { recipientId, recipientType } = req.params;

    const notifications = await Notification.find({
      recipientId,
      recipientType,
    }).sort({ createdAt: -1 }); // newest first

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

// ✅ Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
};
