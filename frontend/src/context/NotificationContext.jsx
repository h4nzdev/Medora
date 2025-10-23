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
import ringtone from "../assets/notification.mp3";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [prevNotifications, setPrevNotifications] = useState([]);
  const [showSplashNotif, setShowSplashNotif] = useState(true);

  useEffect(() => {
    if (user && user._id && user.role) {
      const fetchNotifications = async () => {
        try {
          // Determine recipient type based on user role
          const recipientType = user.role === "clinic" ? "Clinic" : "Client";
          const fetchedNotifications = await getUserNotifications(
            user._id,
            recipientType
          );
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
      // Find brand new notifications that were not seen before
      const newOnes = notifications.filter(
        (n) => !prevNotifications.some((pn) => pn._id === n._id)
      );

      if (newOnes.length > 0) {
        // 🔔 Play ringtone ONCE
        const audio = new Audio(ringtone);
        audio.currentTime = 0;
        audio.play().catch((err) => {
          console.error("Audio play failed:", err);
        });

        // 📌 Show ONLY ONE toast for the batch
        toast.info(
          newOnes.length === 1
            ? newOnes[0].message
            : `You have ${newOnes.length} new notifications`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            toastId: "batch-notification", // 🔑 same ID so it won't stack
          }
        );

        // ✅ Mark that we've already shown these
        setPrevNotifications((prev) => [...prev, ...newOnes]);
      }
    }
  }, [notifications, prevNotifications]);

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
    if (!user?._id || !user?.role) return;

    try {
      const recipientType = user.role === "clinic" ? "Clinic" : "Client";
      await markAllNotificationsAsRead(user._id, recipientType);

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all notifications as read.");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await deleteNotificationService(id); // Use the renamed import
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification.");
    }
  };

  const deleteAllNotifications = async () => {
    if (!user?._id || !user?.role) return;

    try {
      const recipientType = user.role === "clinic" ? "Clinic" : "Client";
      await deleteAllNotificationsService(user._id, recipientType); // Use the renamed import

      // Clear local state
      setNotifications([]);
      setPrevNotifications([]);

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
