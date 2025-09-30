import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getUserNotifications, markNotificationAsRead } from "../services/notificationService";
import { AuthContext } from "./AuthContext";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [prevNotifications, setPrevNotifications] = useState([]);

  useEffect(() => {
    if (user && user._id && user.role) {
      const fetchNotifications = async () => {
        try {
          const fetchedNotifications = await getUserNotifications(user._id, "Client");
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
    if (notifications.length > 0) {
      const newUnread = notifications.filter(
        (n) => !n.isRead && !prevNotifications.some((pn) => pn._id === n._id)
      );

      newUnread.forEach((notification) => {
        toast.info(notification.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

      setPrevNotifications(notifications);
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
    <NotificationContext.Provider value={{ notifications, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
