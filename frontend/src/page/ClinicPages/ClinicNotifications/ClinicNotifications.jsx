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
  Users,
  Clock,
  Eye,
  ArrowRight,
} from "lucide-react";
import { useNotification } from "../../../context/NotificationContext";
import { formatDate, useTime } from "../../../utils/date";
import { useNavigate } from "react-router-dom";

const ClinicNotifications = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotification();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSystemNotification, setSelectedSystemNotification] =
    useState(null);
  const [showSystemModal, setShowSystemModal] = useState(false);

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

  const getActionLink = (notification) => {
    if (notification.type === "appointment") {
      return {
        label: "View Appointments",
        path: "/clinic/appointments",
        color: "bg-cyan-600 hover:bg-cyan-700",
      };
    }

    if (notification.type === "payment") {
      return {
        label: "View Payments",
        path: "/clinic/payments",
        color: "bg-emerald-600 hover:bg-emerald-700",
      };
    }

    return {
      label: "View Details",
      path: "/clinic/dashboard",
      color: "bg-slate-600 hover:bg-slate-700",
    };
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

  const handleViewSystemFeedback = (notification) => {
    if (notification.type === "system") {
      setSelectedSystemNotification(notification);
      setShowSystemModal(true);
    }
  };

  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.isRead
  );

  const hasNotifications = notifications.length > 0;

  return (
    <div className="w-full min-h-screen bg-slate-50 pb-6">
      <div className="mx-auto">
        {/* Clean Header with Stats */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-cyan-600 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">
                    Clinic Notifications
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Manage appointments, payments, and clinic operations
                  </p>
                </div>
              </div>

              {/* Simple Stats */}
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-slate-200">
                  <Bell className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">
                    Total: {notifications.length}
                  </span>
                </div>
                {hasUnreadNotifications && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-slate-200">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">
                      Unread: {notifications.filter((n) => !n.isRead).length}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Delete All Button */}
              {hasNotifications && (
                <button
                  onClick={handleDeleteAllNotifications}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash className="w-4 h-4" />
                  <span className="font-medium">Clear All</span>
                </button>
              )}

              {/* Mark All as Read Button */}
              {hasUnreadNotifications && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span className="font-medium">Mark All Read</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Clean Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-800">
                  Filters
                </h3>
              </div>

              {/* Filter Options */}
              <div className="space-y-2 mb-6">
                {filterOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setFilterType(option.value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        filterType === option.value
                          ? "bg-cyan-600 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions */}
              {hasNotifications && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">
                    Quick Actions
                  </h4>
                  <div className="space-y-2">
                    {hasUnreadNotifications && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="w-full flex items-center gap-3 p-3 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCheck className="w-4 h-4" />
                        <span className="font-medium">Mark All Read</span>
                      </button>
                    )}
                    <button
                      onClick={handleDeleteAllNotifications}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="font-medium">Delete All</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Mobile Filter */}
          <div className="lg:hidden mb-6">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 h-12 rounded-lg border border-slate-300 bg-white hover:border-slate-400 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-700">
                    {
                      filterOptions.find((opt) => opt.value === filterType)
                        ?.label
                    }
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform ${
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
                  />
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-slate-200 shadow-lg z-20 overflow-hidden">
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
                          className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
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
              <h2 className="text-2xl font-semibold text-slate-800">
                Recent Activity
              </h2>
              <p className="text-slate-600 mt-1">
                {filteredNotifications.length} notification
                {filteredNotifications.length !== 1 ? "s" : ""} found
                {hasUnreadNotifications && (
                  <span className="ml-2 text-cyan-600 font-medium">
                    ({notifications.filter((n) => !n.isRead).length} unread)
                  </span>
                )}
              </p>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  className="pl-10 h-12 rounded-lg border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 w-full bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => {
                  const actionLink = getActionLink(notification);

                  return (
                    <div
                      key={notification._id}
                      className={`bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow ${
                        !notification.isRead
                          ? "border-l-4 border-l-cyan-500 bg-cyan-50/50"
                          : ""
                      } ${
                        notification.type === "system" ? "cursor-pointer" : ""
                      }`}
                      onClick={() =>
                        notification.type === "system" &&
                        handleViewSystemFeedback(notification)
                      }
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg ${getNotificationColor(
                            notification.type
                          )} flex-shrink-0`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 className="font-semibold text-slate-800 text-lg leading-relaxed">
                              {notification.message}
                              {notification.type === "system" && (
                                <span className="ml-2 text-sm text-slate-500 font-normal">
                                  (Click to view details)
                                </span>
                              )}
                            </h3>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {!notification.isRead && (
                                <span
                                  className="w-2 h-2 bg-cyan-500 rounded-full"
                                  title="Unread"
                                ></span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNotification(notification._id);
                                }}
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete notification"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Action Link - Don't show for system notifications */}
                          {notification.type !== "system" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(actionLink.path);
                              }}
                              className={`px-4 py-2 ${actionLink.color} text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2`}
                            >
                              {actionLink.label}
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                            <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {formatDate(notification.createdAt)},{" "}
                              {useTime(notification.createdAt)}
                            </p>

                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification._id);
                                  }}
                                  className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-lg text-sm font-medium hover:bg-cyan-200 transition-colors"
                                >
                                  Mark as Read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <div className="bg-slate-100 rounded-xl p-6 w-fit mx-auto mb-6">
                    <Bell className="w-12 h-12 text-slate-400 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    All caught up! 🎉
                  </h3>
                  <p className="text-slate-500">
                    No notifications found. Your clinic is running smoothly!
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* System Feedback Modal */}
      {showSystemModal && selectedSystemNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              System Update Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Message
                </label>
                <p className="text-slate-800 bg-slate-50 p-3 rounded-lg whitespace-pre-line">
                  {selectedSystemNotification.systemMessage}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Date
                </label>
                <p className="text-slate-800">
                  {formatDate(selectedSystemNotification.createdAt)},{" "}
                  {useTime(selectedSystemNotification.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowSystemModal(false);
                  setSelectedSystemNotification(null);
                }}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicNotifications;
