import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification as deleteNotificationService,
  deleteAllNotifications as deleteAllNotificationsService,
} from "../services/notificationService";
import { AuthContext } from "./AuthContext";
import { useSettings } from "./SettingsContext";
import ringtone from "../assets/notification.mp3";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { settings } = useSettings();
  const [notifications, setNotifications] = useState([]);
  const [shownNotificationIds, setShownNotificationIds] = useState(new Set()); // Track shown notifications by ID
  const [showSplashNotif, setShowSplashNotif] = useState(true);

  // FIXED: Consistent role checking
  const getRecipientType = () => {
    if (!user?.role) return null;
    const normalizedRole = user.role.toLowerCase();
    return normalizedRole === "clinic" ? "Clinic" : "Client";
  };

  useEffect(() => {
    if (user && user._id && user.role) {
      const fetchNotifications = async () => {
        try {
          const recipientType = getRecipientType();
          if (!recipientType) return;

          console.log("🔔 Fetching notifications for:", {
            userId: user._id,
            recipientType,
            userRole: user.role,
          });

          const fetchedNotifications = await getUserNotifications(
            user._id,
            recipientType
          );

          console.log("📥 Fetched notifications:", fetchedNotifications);
          setNotifications(fetchedNotifications);
        } catch (error) {
          console.error("Failed to fetch notifications.", error);
        }
      };

      fetchNotifications(); // Initial fetch
      const interval = setInterval(fetchNotifications, 5000); // Fetch every 5 seconds

      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (!showSplashNotif && notifications.length > 0) {
      // Find brand new notifications that haven't been shown yet
      const newOnes = notifications.filter(
        (notification) => !shownNotificationIds.has(notification._id)
      );

      console.log("🎯 New notifications to show:", newOnes);

      if (newOnes.length > 0) {
        // 🔔 Play ringtone ONLY if sound is enabled
        if (settings.soundEnabled) {
          const audio = new Audio(ringtone);
          audio.currentTime = 0;
          audio.play().catch((err) => {
            console.error("Audio play failed:", err);
          });
        }

        // In your NotificationContext useEffect
        if (settings.notifications) {
          newOnes.forEach((notification) => {
            console.log("🚀 Showing toast for:", notification.message);
            toast.info(notification.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              toastId: `notification-${notification._id}`,
            });
          });
        }

        // ✅ Mark these notifications as shown by adding their IDs to the Set
        setShownNotificationIds((prev) => {
          const newSet = new Set(prev);
          newOnes.forEach((notification) => {
            newSet.add(notification._id);
          });
          return newSet;
        });
      }
    }
  }, [notifications, shownNotificationIds, settings, showSplashNotif]);

  // Reset shown notifications when user changes
  useEffect(() => {
    setShownNotificationIds(new Set());
  }, [user?._id]);

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      toast.error("Failed to mark notification as read.");
    }
  };

  const markAllAsRead = async () => {
    const recipientType = getRecipientType();
    if (!user?._id || !recipientType) return;

    try {
      await markAllNotificationsAsRead(user._id, recipientType);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all notifications as read.");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await deleteNotificationService(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      // Also remove from shown notifications
      setShownNotificationIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification.");
    }
  };

  const deleteAllNotifications = async () => {
    const recipientType = getRecipientType();
    if (!user?._id || !recipientType) return;

    try {
      await deleteAllNotificationsService(user._id, recipientType);
      setNotifications([]);
      setShownNotificationIds(new Set());
      toast.success("All notifications deleted");
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      toast.error("Failed to delete all notifications.");
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
        setShowSplashNotif,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
