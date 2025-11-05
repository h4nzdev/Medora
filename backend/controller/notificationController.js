import Notification from "../model/notificationModel.js";

// ✅ Create a new notification
export const createNotification = async (req, res) => {
  try {
    const {
      recipientId,
      recipientType,
      systemMessage,
      message,
      type,
      relatedId,
    } = req.body;

    // For "all" recipientType, recipientId is not required
    if (recipientType !== "all" && !recipientId) {
      return res.status(400).json({
        message: "recipientId is required for specific recipient types",
      });
    }

    const notification = await Notification.create({
      recipientId: recipientType === "all" ? undefined : recipientId,
      recipientType,
      message,
      systemMessage,
      type,
      relatedId,
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

    // For specific users/clinics, get their specific notifications + system-wide notifications
    const notifications = await Notification.find({
      $or: [
        { recipientId, recipientType }, // Their specific notifications
        { recipientType: "all" }, // System-wide notifications for everyone
      ],
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

// ✅ Mark all notifications as read for a user
export const markAllAsRead = async (req, res) => {
  try {
    const { recipientId, recipientType } = req.body;

    const result = await Notification.updateMany(
      {
        $or: [
          { recipientId, recipientType }, // Their specific notifications
          { recipientType: "all" }, // System-wide notifications
        ],
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.status(200).json({
      message: `${result.modifiedCount} notifications marked as read`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking all notifications as read", error });
  }
};

// ✅ Delete a single notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification deleted successfully",
      deletedNotification: notification,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification", error });
  }
};

// ✅ Delete all notifications for a user
export const deleteAllNotifications = async (req, res) => {
  try {
    const { recipientId, recipientType } = req.body;

    const result = await Notification.deleteMany({
      $or: [
        { recipientId, recipientType }, // Their specific notifications
        { recipientType: "all" }, // System-wide notifications
      ],
    });

    res.status(200).json({
      message: `${result.deletedCount} notifications deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting all notifications", error });
  }
};

// ✅ Get system-wide notifications (for admin view)
export const getSystemNotifications = async (req, res) => {
  try {
    const systemNotifications = await Notification.find({
      recipientType: "all",
    }).sort({ createdAt: -1 });

    res.status(200).json(systemNotifications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching system notifications", error });
  }
};
