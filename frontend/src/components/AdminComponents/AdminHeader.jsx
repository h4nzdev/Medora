import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  Bell,
  Check,
  AlertCircle,
  Info,
  CheckCircle,
  Loader2,
  RefreshCw,
  Calendar,
  CreditCard,
} from "lucide-react";
import useResponsive from "../../hooks/useResponsive";
import { getUserNotifications } from "../../services/notificationService";
import { AuthContext } from "../../context/AuthContext";

const AdminHeader = () => {
  const { user } = useContext(AuthContext);
  const { isMobile } = useResponsive();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications when dropdown opens
  const fetchNotifications = async () => {
    if (!isNotificationOpen) return;

    setLoading(true);
    setError(null);
    try {
      const adminId = user?._id || user?.id;
      if (!adminId) throw new Error("Admin ID not found");

      // Call the API with admin ID and recipientType "Admin"
      const data = await getUserNotifications(adminId, "Admin");
      console.log("API Response:", data); // Debug log

      // Transform the data to match model structure
      const formattedNotifications = Array.isArray(data)
        ? data.map((notification) => ({
            id: notification._id || notification.id,
            title: notification.systemMessage || notification.message,
            message: notification.message || "New notification",
            systemMessage: notification.systemMessage,
            time: formatTimeAgo(notification.createdAt),
            type: notification.type || "system",
            isRead: notification.isRead || false,
            recipientType: notification.recipientType,
            recipientId: notification.recipientId,
            relatedId: notification.relatedId,
          }))
        : [];

      setNotifications(formattedNotifications);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError(err.message || "Failed to load notifications");
      // Use fallback if API fails
      setNotifications(getFallbackNotifications());
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp to relative time
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Recently";

    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 604800)
        return `${Math.floor(diffInSeconds / 86400)} days ago`;

      return date.toLocaleDateString();
    } catch (error) {
      return "Recently";
    }
  };

  // Fallback notifications with correct model structure
  const getFallbackNotifications = () => [
    {
      id: "1",
      title: "System Update Available",
      message: "New system features have been deployed",
      systemMessage: "System Update Available",
      time: "2 minutes ago",
      type: "system",
      isRead: false,
      recipientType: "Admin",
      recipientId: user?._id,
    },
    {
      id: "2",
      title: "Appointment Scheduled",
      message: "New appointment scheduled with Dr. Smith",
      systemMessage: "New Appointment",
      time: "1 hour ago",
      type: "appointment",
      isRead: false,
      recipientType: "Admin",
      recipientId: user?._id,
    },
    {
      id: "3",
      title: "Payment Processed",
      message: "Payment of $299.99 has been successfully processed",
      systemMessage: "Payment Received",
      time: "3 hours ago",
      type: "payment",
      isRead: true,
      recipientType: "Admin",
      recipientId: user?._id,
    },
    {
      id: "4",
      title: "System Alert",
      message: "Database backup completed successfully",
      systemMessage: "System Maintenance",
      time: "5 hours ago",
      type: "system",
      isRead: true,
      recipientType: "Admin",
      recipientId: user?._id,
    },
  ];

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isNotificationOpen && user) {
      fetchNotifications();
    }
  }, [isNotificationOpen]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  const getIconByType = (type) => {
    switch (type) {
      case "appointment":
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case "payment":
        return <CreditCard className="w-4 h-4 text-green-500" />;
      case "system":
        return <Info className="w-4 h-4 text-purple-500" />;
      case "other":
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-100/80 sticky top-0 z-40 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <button className="md:hidden">
              <Menu />
            </button>
          )}
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        </div>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={handleNotificationClick}
            className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsNotificationOpen(false)}
              />

              {/* Dropdown Content */}
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">
                      Notifications
                    </h3>
                    <div className="flex items-center space-x-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                      <button
                        onClick={fetchNotifications}
                        disabled={loading}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                        title="Refresh notifications"
                      >
                        <RefreshCw
                          className={`w-4 h-4 text-slate-500 ${
                            loading ? "animate-spin" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    {loading ? (
                      <span className="flex items-center">
                        <Loader2 className="w-3 h-3 animate-spin mr-2" />
                        Loading notifications...
                      </span>
                    ) : error ? (
                      <span className="text-red-500">{error}</span>
                    ) : (
                      `You have ${unreadCount} unread notification${
                        unreadCount !== 1 ? "s" : ""
                      }`
                    )}
                  </p>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="p-8 text-center">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                      <p className="text-slate-500 mt-2">Loading...</p>
                    </div>
                  ) : error ? (
                    <div className="p-8 text-center">
                      <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
                      <p className="text-slate-500">{error}</p>
                      <button
                        onClick={fetchNotifications}
                        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                          !notification.isRead ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            {getIconByType(notification.type)}
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-800 text-sm">
                                {notification.title}
                              </h4>
                              <p className="text-slate-600 text-sm mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-slate-400">
                                  {notification.time}
                                </span>
                                {notification.recipientType === "all" && (
                                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded">
                                    System-wide
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 hover:bg-slate-200 rounded transition-colors ml-2"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4 text-slate-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No notifications yet</p>
                      <p className="text-slate-400 text-sm mt-1">
                        All caught up!
                      </p>
                    </div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 border-t border-slate-100 text-center">
                    <Link
                      to="/admin/notifications"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      onClick={() => setIsNotificationOpen(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
