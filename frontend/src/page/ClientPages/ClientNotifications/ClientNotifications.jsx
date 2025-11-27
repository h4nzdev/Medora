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
  ExternalLink,
  MoreHorizontal,
  ChevronRight,
  Users,
  Clock,
  Eye,
  ArrowRight,
} from "lucide-react";
import { useNotification } from "../../../context/NotificationContext";
import { formatDate, useTime } from "../../../utils/date";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ClientNotifications = () => {
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
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);

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

  // Function to truncate long messages
  const truncateMessage = (message, maxLength = 80) => {
    if (!message) return "";
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  // Function to detect and format links in messages
  const formatMessageWithLinks = (message) => {
    if (!message) return { text: "", hasLinks: false, links: [] };

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const links = message.match(urlRegex) || [];
    let text = message;

    if (links.length > 0) {
      links.forEach((link) => {
        text = text.replace(link, `🔗 ${link}`);
      });
    }

    return {
      text,
      hasLinks: links.length > 0,
      links,
    };
  };

  const notificationConfig = {
    appointment: {
      icon: Calendar,
      color: "bg-cyan-100 text-cyan-700",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700",
      borderColor: "border-cyan-200",
      badge: "Appointment",
    },
    payment: {
      icon: FileText,
      color: "bg-emerald-100 text-emerald-700",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200",
      badge: "Payment",
    },
    system: {
      icon: Info,
      color: "bg-slate-100 text-slate-700",
      bgColor: "bg-slate-50",
      textColor: "text-slate-700",
      borderColor: "border-slate-200",
      badge: "System",
    },
    default: {
      icon: Bell,
      color: "bg-slate-100 text-slate-700",
      bgColor: "bg-slate-50",
      textColor: "text-slate-700",
      borderColor: "border-slate-200",
      badge: "Notification",
    },
  };

  const getNotificationConfig = (type) => {
    return notificationConfig[type] || notificationConfig.default;
  };

  const getActionLink = (notification) => {
    if (notification.type === "appointment") {
      return {
        label: "View Appointments",
        path: "/client/appointments",
        color: "bg-cyan-600 hover:bg-cyan-700",
      };
    }

    if (notification.type === "payment") {
      return {
        label: "View Payments",
        path: "/client/payments",
        color: "bg-emerald-600 hover:bg-emerald-700",
      };
    }

    return {
      label: "View Details",
      path: "/client/dashboard",
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
    deleteNotification(notificationId);
    setShowActionModal(false);
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

  const showNotificationActions = (notification, e) => {
    e?.stopPropagation();
    setSelectedNotification(notification);
    setShowActionModal(true);
  };

  const showNotificationDetails = (notification) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
  };

  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.isRead
  );
  const hasNotifications = notifications.length > 0;

  // Modal animations
  const modalBackdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const modalContentVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      y: "100%",
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 pb-6">
      <div className="mx-auto">
        {/* Clean Header with Stats */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-cyan-600 p-3 rounded-xl">
                  <BellRing className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">
                    Notifications
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Stay updated with your appointments and alerts
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
                  const config = getNotificationConfig(notification.type);
                  const actionLink = getActionLink(notification);
                  const formattedMessage = formatMessageWithLinks(
                    notification.message
                  );
                  const displayMessage = truncateMessage(formattedMessage.text);
                  const isLongMessage = notification.message?.length > 120;

                  return (
                    <div
                      key={notification._id}
                      className={`bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer ${
                        !notification.isRead
                          ? "border-l-4 border-l-cyan-500 bg-cyan-50/50"
                          : ""
                      }`}
                      onClick={() => showNotificationDetails(notification)}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`hidden md:block p-3 rounded-lg ${config.color} flex-shrink-0`}
                        >
                          {config.icon && <config.icon className="w-5 h-5" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
                                >
                                  {config.badge}
                                </span>
                                {!notification.isRead && (
                                  <span
                                    className="w-2 h-2 bg-cyan-500 rounded-full"
                                    title="Unread"
                                  ></span>
                                )}
                              </div>
                              <h3 className="font-semibold text-slate-800 text-lg leading-relaxed">
                                {displayMessage}
                                {isLongMessage && (
                                  <span className="ml-2 text-sm text-cyan-600 font-normal">
                                    (Click to view details)
                                  </span>
                                )}
                              </h3>
                              {formattedMessage.hasLinks && (
                                <div className="flex items-center gap-1 mt-2">
                                  <ExternalLink className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm text-blue-600 font-medium">
                                    Contains {formattedMessage.links.length}{" "}
                                    link(s)
                                  </span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={(e) =>
                                showNotificationActions(notification, e)
                              }
                              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                              title="More options"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Action Link */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(actionLink.path);
                            }}
                            className={`px-4 py-2 ${actionLink.color} text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 mb-4`}
                          >
                            {actionLink.label}
                            <ArrowRight className="w-4 h-4" />
                          </button>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
                    {searchTerm || filterType !== "all"
                      ? "No notifications match your search criteria"
                      : "You're all caught up! No new notifications."}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Notification Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedNotification && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center sm:p-4"
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              className="bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden sm:rounded-2xl"
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      getNotificationConfig(selectedNotification.type).bgColor
                    }`}
                  >
                    {(() => {
                      const IconComponent = getNotificationConfig(
                        selectedNotification.type
                      ).icon;
                      return IconComponent ? (
                        <IconComponent className="w-5 h-5" />
                      ) : null;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {getNotificationConfig(selectedNotification.type).badge}
                    </h3>
                    <p className="text-slate-500 text-sm">
                      {formatDate(selectedNotification.createdAt)} at{" "}
                      {useTime(selectedNotification.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Message
                    </label>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-800 whitespace-pre-line break-words">
                        {selectedNotification.message}
                      </p>
                    </div>
                  </div>

                  {/* Links Section */}
                  {formatMessageWithLinks(selectedNotification.message)
                    .hasLinks && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Links
                      </label>
                      <div className="space-y-2">
                        {formatMessageWithLinks(
                          selectedNotification.message
                        ).links.map((link, index) => (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors truncate"
                          >
                            <ExternalLink className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="text-blue-700 text-sm font-medium truncate">
                              {link}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-4 border-t border-slate-200">
                {!selectedNotification.isRead && (
                  <button
                    onClick={() => {
                      markAsRead(selectedNotification._id);
                      setShowDetailModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-medium"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Modal */}
      <AnimatePresence>
        {showActionModal && selectedNotification && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setShowActionModal(false)}
          >
            <motion.div
              className="bg-white rounded-t-2xl mx-2 mb-2 shadow-2xl w-full max-w-md"
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-1 bg-slate-300 rounded-full" />
              </div>

              {/* Menu header */}
              <div className="px-6 pb-3 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">
                  Notification Options
                </h3>
                <p className="text-slate-500 text-sm mt-1 truncate">
                  {truncateMessage(selectedNotification.message, 50)}
                </p>
              </div>

              {/* Menu items */}
              <div className="py-2">
                {/* Mark as Read/Unread */}
                {!selectedNotification.isRead ? (
                  <button
                    onClick={() => {
                      markAsRead(selectedNotification._id);
                      setShowActionModal(false);
                    }}
                    className="flex items-center w-full px-6 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    <div className="bg-blue-100 p-3 rounded-xl mr-4">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-slate-800 font-medium text-base">
                        Mark as Read
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        Remove unread status
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ) : null}

                {/* View Details */}
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setShowDetailModal(true);
                  }}
                  className="flex items-center w-full px-6 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <div className="bg-cyan-100 p-3 rounded-xl mr-4">
                    <Info className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-slate-800 font-medium text-base">
                      View Details
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      See full message
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Delete Notification */}
                <button
                  onClick={() =>
                    handleDeleteNotification(selectedNotification._id)
                  }
                  className="flex items-center w-full px-6 py-4 hover:bg-red-50 active:bg-red-100 transition-colors"
                >
                  <div className="bg-red-100 p-3 rounded-xl mr-4">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-red-600 font-medium text-base">
                      Delete Notification
                    </p>
                    <p className="text-red-400 text-sm mt-1">
                      Remove permanently
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-400" />
                </button>
              </div>

              {/* Cancel button */}
              <button
                onClick={() => setShowActionModal(false)}
                className="mx-4 my-3 bg-slate-100 py-4 rounded-xl w-[calc(100%-2rem)] hover:bg-slate-200 active:bg-slate-300 transition-colors"
              >
                <p className="text-slate-600 font-semibold text-base">Close</p>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientNotifications;
