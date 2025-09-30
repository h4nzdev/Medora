"use client";

import { useState, useEffect, useContext } from "react";
import { BellRing, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../../context/AuthContext";
import { getUserNotifications, markNotificationAsRead } from "../../../services/notificationService";

const ClientNotifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user && user._id && user.role) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const fetchedNotifications = await getUserNotifications(user._id, "Client");
      setNotifications(fetchedNotifications);
    } catch (error) {
      toast.error("Failed to fetch notifications.");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      // Update the state to reflect the change
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      toast.success("Notification marked as read.");
    } catch (error) {
      toast.error("Failed to mark notification as read.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 pb-6">
      <div className="mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            My Notifications
          </h1>
          <p className="text-slate-600 mt-2 font-medium tracking-wide">
            Stay updated with your appointments and messages.
          </p>
        </header>

        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <BellRing className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium text-lg">
              No notifications yet.
            </p>
          </div>
        ) : (
          <section className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white/70 rounded-xl p-6 shadow flex items-center justify-between hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                  notification.isRead ? "opacity-60" : ""
                }`}>
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${{
                      appointment: "bg-blue-100 text-blue-600",
                      payment: "bg-green-100 text-green-600",
                      system: "bg-slate-100 text-slate-600",
                    }[notification.type]}`}>
                    {notification.type === "appointment" && <BellRing className="w-6 h-6" />}
                    {notification.type === "payment" && <CheckCircle className="w-6 h-6" />}
                    {notification.type === "system" && <XCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800">
                      {notification.message}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all font-medium">
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default ClientNotifications;
