"use client";

import { useState, useMemo } from "react";
import {
  BellRing,
  CheckCircle,
  XCircle,
  Bell,
  Search,
  Calendar,
  FileText,
  AlertCircle,
  Info,
  Filter,
  Trash2,
  CheckCheck,
  Trash,
} from "lucide-react";
import { useNotification } from "../../../context/NotificationContext";
import { formatDate, useTime } from "../../../utils/date";

const ClientNotifications = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotification();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((notification) => {
        if (filterType === "all") return true;
        if (filterType === "unread") return !notification.isRead;
        return notification.type === filterType;
      })
      .filter((notification) => {
        const searchTermLower = searchTerm.toLowerCase();
        const message = notification.message?.toLowerCase() || "";
        return message.includes(searchTermLower);
      });
  }, [notifications, filterType, searchTerm]);

  const getNotificationIcon = (type) => {
    const iconMap = {
      appointment: <Calendar className="w-5 h-5" />,
      payment: <FileText className="w-5 h-5" />,
      system: <Info className="w-5 h-5" />,
    };
    return iconMap[type] || <Bell className="w-5 h-5" />;
  };

  const getNotificationColor = (type) => {
    const colorMap = {
      appointment: "bg-cyan-100 text-cyan-700",
      payment: "bg-emerald-100 text-emerald-700",
      system: "bg-slate-100 text-slate-700",
    };
    return colorMap[type] || "bg-slate-100 text-slate-700";
  };

  const filterOptions = [
    { label: "All Notifications", value: "all", icon: Bell },
    { label: "Unread Only", value: "unread", icon: AlertCircle },
    { label: "Appointments", value: "appointment", icon: Calendar },
    { label: "Payments", value: "payment", icon: FileText },
    { label: "System", value: "system", icon: Info },
  ];

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleDeleteNotification = (notificationId) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      deleteNotification(notificationId);
    }
  };

  const handleDeleteAllNotifications = () => {
    if (
      window.confirm(
        "Are you sure you want to delete all notifications? This action cannot be undone."
      )
    ) {
      deleteAllNotifications();
    }
  };

  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.isRead
  );

  const hasNotifications = notifications.length > 0;

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
                Stay updated with your appointments, payments, and alerts.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Delete All Button */}
              {hasNotifications && (
                <button
                  onClick={handleDeleteAllNotifications}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <Trash className="w-4 h-4" />
                  <span className="font-medium">Delete All</span>
                </button>
              )}

              {/* Mark All as Read Button */}
              {hasUnreadNotifications && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span className="font-medium">Mark All as Read</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar Filter */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg font-bold text-slate-800">Filters</h3>
              </div>
              <div className="space-y-2">
                {filterOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setFilterType(option.value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                        filterType === option.value
                          ? "bg-cyan-600 text-white shadow-md"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions in Sidebar */}
              {hasNotifications && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">
                    Quick Actions
                  </h4>
                  <div className="space-y-2">
                    {hasUnreadNotifications && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all duration-200"
                      >
                        <CheckCheck className="w-4 h-4" />
                        <span className="font-medium">Mark All Read</span>
                      </button>
                    )}
                    <button
                      onClick={handleDeleteAllNotifications}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-red-700 bg-red-50 hover:bg-red-100 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="font-medium">Delete All</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Mobile Top Filter - Custom Dropdown */}
          <div className="lg:hidden mb-6">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 h-12 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm hover:border-cyan-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-slate-700">
                    {
                      filterOptions.find((opt) => opt.value === filterType)
                        ?.label
                    }
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  ></div>
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {filterOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setFilterType(option.value);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                            filterType === option.value
                              ? "bg-cyan-50 text-cyan-700 font-semibold"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="font-medium">{option.label}</span>
                          {filterType === option.value && (
                            <CheckCircle className="w-4 h-4 ml-auto text-cyan-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Main Content */}
          <section className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Recent Notifications
              </h2>
              <p className="text-slate-600 mt-2 text-lg">
                {filteredNotifications.length} notification
                {filteredNotifications.length !== 1 ? "s" : ""} found
                {hasUnreadNotifications && (
                  <span className="ml-2 text-cyan-600 font-semibold">
                    ({notifications.filter((n) => !n.isRead).length} unread)
                  </span>
                )}
              </p>
            </div>

            <div className="mb-6">
              <div className="relative">
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

            <div className="space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${
                      !notification.isRead ? "border-l-4 border-l-cyan-500" : ""
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
                            {notification.message}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.isRead && (
                              <span className="flex-shrink-0 w-2 h-2 bg-cyan-500 rounded-full mt-2"></span>
                            )}
                            {/* Delete Button */}
                            <button
                              onClick={() =>
                                handleDeleteNotification(notification._id)
                              }
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Delete notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <p className="text-sm text-slate-500 font-medium">
                            {formatDate(notification.createdAt)},{" "}
                            {useTime(notification.createdAt)}
                          </p>

                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <button
                                type="button"
                                onClick={() => markAsRead(notification._id)}
                                className="px-4 py-2 bg-cyan-50 text-cyan-700 rounded-lg text-sm font-medium hover:bg-cyan-100 transition-colors duration-200"
                              >
                                Mark as Read
                              </button>
                            )}
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
          </section>
        </div>
      </div>
    </div>
  );
};

export default ClientNotifications;
  