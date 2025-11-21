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
} from "lucide-react";
import { useNotification } from "../../../context/NotificationContext";
import { formatDate, useTime } from "../../../utils/date";
import { motion, AnimatePresence } from "framer-motion";

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
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      badge: "Appointment",
    },
    payment: {
      icon: FileText,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      badge: "Payment",
    },
    system: {
      icon: Info,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      badge: "System",
    },
    default: {
      icon: Bell,
      color: "bg-gray-500",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      borderColor: "border-gray-200",
      badge: "Notification",
    },
  };

  const getNotificationConfig = (type) => {
    return notificationConfig[type] || notificationConfig.default;
  };

  const filterOptions = [
    { label: "All", value: "all", icon: Bell, count: notifications.length },
    {
      label: "Unread",
      value: "unread",
      icon: AlertCircle,
      count: notifications.filter((n) => !n.isRead).length,
    },
    {
      label: "Appointments",
      value: "appointment",
      icon: Calendar,
      count: notifications.filter((n) => n.type === "appointment").length,
    },
    {
      label: "Payments",
      value: "payment",
      icon: FileText,
      count: notifications.filter((n) => n.type === "payment").length,
    },
    {
      label: "System",
      value: "system",
      icon: Info,
      count: notifications.filter((n) => n.type === "system").length,
    },
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
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
              <BellRing className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-800 truncate">
                Notifications
              </h1>
              <p className="text-slate-600 text-sm sm:text-base">
                Stay updated with your appointments and alerts
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow border border-slate-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">
                  Total
                </p>
                <p className="text-lg sm:text-2xl font-semibold text-cyan-600 truncate">
                  {notifications.length}
                </p>
              </div>
              <div className="bg-cyan-500 p-2 sm:p-3 rounded-xl shadow-md flex-shrink-0">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow border border-slate-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">
                  Unread
                </p>
                <p className="text-lg sm:text-2xl font-semibold text-orange-600 truncate">
                  {notifications.filter((n) => !n.isRead).length}
                </p>
              </div>
              <div className="bg-orange-500 p-2 sm:p-3 rounded-xl shadow-md flex-shrink-0">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white rounded-xl sm:rounded-2xl shadow border border-slate-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">
                  This Week
                </p>
                <p className="text-lg sm:text-2xl font-semibold text-blue-600 truncate">
                  {
                    notifications.filter((n) => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(n.createdAt) > weekAgo;
                    }).length
                  }
                </p>
              </div>
              <div className="bg-blue-500 p-2 sm:p-3 rounded-xl shadow-md flex-shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Desktop Sidebar Filter */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow border border-slate-200 p-4 sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-800">
                  Filters
                </h3>
              </div>

              <div className="space-y-1">
                {filterOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isActive = filterType === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setFilterType(option.value)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 text-sm ${
                        isActive
                          ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <span className="font-medium truncate">
                          {option.label}
                        </span>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                          isActive
                            ? "bg-cyan-100 text-cyan-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {option.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter and Search */}
            <div className="lg:hidden space-y-3 mb-4">
              {/* Mobile Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow text-sm font-medium"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Filter className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <span className="truncate">
                      {
                        filterOptions.find((opt) => opt.value === filterType)
                          ?.label
                      }
                    </span>
                  </div>
                  <div
                    className={`transform transition-transform flex-shrink-0 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="w-4 h-4 text-slate-600"
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
                  </div>
                </button>

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg z-20 overflow-hidden">
                      {filterOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              setFilterType(option.value);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-3 text-sm transition-colors ${
                              filterType === option.value
                                ? "bg-cyan-50 text-cyan-700"
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4" />
                              <span className="truncate">{option.label}</span>
                            </div>
                            <span className="px-1.5 py-0.5 bg-slate-100 rounded-full text-xs font-medium flex-shrink-0">
                              {option.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex gap-2">
                {hasUnreadNotifications && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-cyan-600 text-white rounded-lg text-xs font-medium shadow hover:bg-cyan-700 transition-colors"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Mark All Read
                  </button>
                )}
                {hasNotifications && (
                  <button
                    onClick={handleDeleteAllNotifications}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-medium shadow hover:bg-red-700 transition-colors"
                  >
                    <Trash className="w-3 h-3" />
                    Delete All
                  </button>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => {
                  const config = getNotificationConfig(notification.type);
                  const IconComponent = config.icon;
                  const formattedMessage = formatMessageWithLinks(
                    notification.message
                  );
                  const displayMessage = truncateMessage(formattedMessage.text);
                  const isLongMessage = notification.message?.length > 120;

                  return (
                    <div
                      key={notification._id}
                      className={`bg-white rounded-xl border-l-4 ${
                        !notification.isRead
                          ? "border-l-cyan-500 bg-cyan-50/30"
                          : "border-l-gray-200"
                      } shadow border border-slate-200 hover:shadow-md transition-all duration-200 group`}
                      onClick={() => showNotificationDetails(notification)}
                    >
                      <div className="p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          {/* Notification Icon */}
                          <div
                            className={`p-2 rounded-lg ${config.bgColor} flex-shrink-0`}
                          >
                            <IconComponent
                              className={`w-4 h-4 ${config.textColor}`}
                            />
                          </div>

                          {/* Notification Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
                                  >
                                    {config.badge}
                                  </span>
                                  {!notification.isRead && (
                                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full flex-shrink-0"></span>
                                  )}
                                </div>
                                <p className="text-slate-800 font-medium text-sm leading-relaxed break-words">
                                  {displayMessage}
                                  {isLongMessage && (
                                    <span className="text-cyan-600 font-semibold ml-1 text-xs">
                                      Read more
                                    </span>
                                  )}
                                </p>
                                {formattedMessage.hasLinks && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <ExternalLink className="w-3 h-3 text-blue-500" />
                                    <span className="text-xs text-blue-600 font-medium">
                                      Contains {formattedMessage.links.length}{" "}
                                      link(s)
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Action Button */}
                              <button
                                onClick={(e) =>
                                  showNotificationActions(notification, e)
                                }
                                className="p-1 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                              >
                                <MoreHorizontal className="w-4 h-4 text-slate-600" />
                              </button>
                            </div>

                            {/* Timestamp */}
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 text-xs font-medium">
                                {formatDate(notification.createdAt)} at{" "}
                                {useTime(notification.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Empty State */
                <div className="bg-white rounded-xl shadow border border-slate-200 p-8 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-700 mb-2">
                    No notifications found
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {searchTerm || filterType !== "all"
                      ? "Try adjusting your search or filter"
                      : "You're all caught up!"}
                  </p>
                </div>
              )}
            </div>
          </div>
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
                    {getNotificationIcon(selectedNotification.type)}
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
                            className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors turncate-2"
                          >
                            <ExternalLink className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="text-blue-700 text-sm font-medium">
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

// Helper function to get notification icon
const getNotificationIcon = (type) => {
  const iconMap = {
    appointment: <Calendar className="w-5 h-5" />,
    payment: <FileText className="w-5 h-5" />,
    system: <Info className="w-5 h-5" />,
  };
  return iconMap[type] || <Bell className="w-5 h-5" />;
};

export default ClientNotifications;
