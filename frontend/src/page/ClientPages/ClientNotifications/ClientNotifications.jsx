import React, { useState, useEffect, useContext } from "react";
import {
  Bell,
  Search,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { formatDate } from "../../../utils/date";

export default function ClientNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Simulate loading - replace with actual API call
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [user]);

  const filteredNotifications = notifications.filter((notification) => {
    const searchTermLower = searchTerm.toLowerCase();
    const title = notification.title?.toLowerCase() || "";
    const message = notification.message?.toLowerCase() || "";
    return title.includes(searchTermLower) || message.includes(searchTermLower);
  });

  // Calculate stats
  const unreadCount = notifications.filter((n) => !n.read).length;
  const appointmentNotifs = notifications.filter(
    (n) => n.type === "appointment"
  ).length;
  const invoiceNotifs = notifications.filter(
    (n) => n.type === "invoice"
  ).length;
  const generalNotifs = notifications.filter(
    (n) => n.type === "general"
  ).length;

  const getNotificationIcon = (type) => {
    const iconMap = {
      appointment: <Calendar className="w-5 h-5" />,
      invoice: <FileText className="w-5 h-5" />,
      alert: <AlertCircle className="w-5 h-5" />,
      success: <CheckCircle className="w-5 h-5" />,
      general: <Info className="w-5 h-5" />,
    };
    return iconMap[type] || iconMap.general;
  };

  const getNotificationColor = (type) => {
    const colorMap = {
      appointment: "bg-cyan-100 text-cyan-700",
      invoice: "bg-purple-100 text-purple-700",
      alert: "bg-red-100 text-red-700",
      success: "bg-emerald-100 text-emerald-700",
      general: "bg-slate-100 text-slate-700",
    };
    return colorMap[type] || colorMap.general;
  };

  const stats = [
    {
      title: "All Notifications",
      value: notifications.length,
      icon: Bell,
      color: "bg-gradient-to-br from-slate-50 to-slate-100",
      iconBg: "bg-gradient-to-br from-slate-100 to-slate-200",
      iconColor: "text-slate-600",
      textColor: "text-slate-700",
    },
    {
      title: "Unread",
      value: unreadCount,
      icon: AlertCircle,
      color: "bg-gradient-to-br from-cyan-50 to-sky-50",
      iconBg: "bg-gradient-to-br from-cyan-100 to-sky-100",
      iconColor: "text-cyan-600",
      textColor: "text-cyan-700",
    },
    {
      title: "Appointments",
      value: appointmentNotifs,
      icon: Calendar,
      color: "bg-gradient-to-br from-emerald-50 to-green-50",
      iconBg: "bg-gradient-to-br from-emerald-100 to-green-100",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-700",
    },
    {
      title: "Invoices",
      value: invoiceNotifs,
      icon: FileText,
      color: "bg-gradient-to-br from-amber-50 to-orange-50",
      iconBg: "bg-gradient-to-br from-amber-100 to-orange-100",
      iconColor: "text-amber-600",
      textColor: "text-amber-700",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30 pb-6">
      <div className="mx-auto">
        <header className="mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
                Notifications
              </h1>
              <p className="text-slate-600 mt-3 text-lg sm:text-xl leading-relaxed">
                Stay updated with your appointments, invoices, and alerts.
              </p>
            </div>
          </div>
        </header>

        <section className="mb-8 md:mb-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className={`${stat.color} backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p
                        className={`${stat.textColor} text-sm md:text-base font-semibold uppercase tracking-wider mb-3 truncate opacity-80`}
                      >
                        {stat.title}
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-slate-800 group-hover:scale-105 transition-transform duration-300">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-3 md:p-4 rounded-xl ${stat.iconBg} ml-3 flex-shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}
                    >
                      <IconComponent
                        className={`w-6 h-6 md:w-7 md:h-7 ${stat.iconColor}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Recent Notifications
            </h2>
            <p className="text-slate-600 mt-2 text-lg">
              {filteredNotifications.length} notification
              {filteredNotifications.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notifications..."
                className="pl-10 h-12 rounded-xl border border-slate-200 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200/50 w-full bg-white/80 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 w-fit mx-auto mb-6">
                <Bell className="w-16 h-16 text-slate-400 mx-auto animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">
                Loading notifications...
              </h3>
            </div>
          ) : (
            <>
              {/* Mobile & Desktop List */}
              <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification, index) => (
                    <div
                      key={notification._id || index}
                      className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${
                        !notification.read ? "border-l-4 border-l-cyan-500" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-xl ${getNotificationColor(
                            notification.type
                          )} flex-shrink-0 shadow-sm`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="font-bold text-slate-800 text-lg group-hover:text-cyan-600 transition-colors duration-300">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="flex-shrink-0 w-2 h-2 bg-cyan-500 rounded-full mt-2"></span>
                            )}
                          </div>

                          <p className="text-slate-600 text-base mb-3 leading-relaxed">
                            {notification.message}
                          </p>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-sm text-slate-500 font-medium">
                              {formatDate(notification.createdAt)}
                            </p>

                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <button
                                  type="button"
                                  className="px-4 py-2 bg-cyan-50 text-cyan-700 rounded-lg text-sm font-medium hover:bg-cyan-100 transition-colors duration-200"
                                >
                                  Mark as Read
                                </button>
                              )}
                              <button
                                type="button"
                                className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors duration-200"
                                aria-label="Delete notification"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 w-fit mx-auto mb-6">
                      <Bell className="w-16 h-16 text-slate-400 mx-auto" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">
                      No notifications found
                    </h3>
                    <p className="text-slate-500 text-lg">
                      You're all caught up! New notifications will appear here.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
