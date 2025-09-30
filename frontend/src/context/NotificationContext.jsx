import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getUserNotifications,
  markNotificationAsRead,
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
          const fetchedNotifications = await getUserNotifications(
            user._id,
            "Client"
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

        // ✅ Mark that we’ve already shown these
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

  return (
    <NotificationContext.Provider
      value={{ notifications, markAsRead, setShowSplashNotif }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
