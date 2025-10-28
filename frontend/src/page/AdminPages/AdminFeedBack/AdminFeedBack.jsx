import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Trash2,
  Reply,
  Bug,
  Lightbulb,
  AlertTriangle,
  Heart,
  User,
  Calendar,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { getAllFeedback } from "../../../services/feedbackService";

const AdminFeedBack = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Safe mock data as fallback
  const getMockFeedbacks = () => [
    {
      _id: "1",
      userId: "user1",
      userName: "Maria Santos",
      userEmail: "maria.santos@email.com",
      message:
        "The appointment booking calendar sometimes shows unavailable dates as available. Please fix this bug as it causes confusion for patients.",
      type: "bug",
      createdAt: "2024-10-14T10:30:00Z",
      status: "new",
      priority: "high",
    },
    {
      _id: "2",
      userId: "user2",
      userName: "Juan Dela Cruz",
      userEmail: "juan.dc@email.com",
      message:
        "It would be great to have a dark mode option for the app. Many users prefer dark themes especially when using the app at night.",
      type: "suggestion",
      createdAt: "2024-10-13T15:45:00Z",
      status: "in-progress",
      priority: "medium",
    },
    {
      _id: "3",
      userId: "user3",
      userName: "Anna Reyes",
      userEmail: "anna.reyes@email.com",
      message:
        "The chat feature with AI is amazing! It helped me understand my symptoms better before my appointment. Great work team!",
      type: "compliment",
      createdAt: "2024-10-12T09:15:00Z",
      status: "resolved",
      priority: "low",
    },
  ];

  // Safe data fetching
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        setError(null);
        const feedbacksData = await getAllFeedback();

        // Validate response data
        if (Array.isArray(feedbacksData)) {
          setFeedbacks(feedbacksData);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Failed to load feedback. Using demo data.");
        setFeedbacks(getMockFeedbacks());
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Safe data access helpers
  const safeString = (str) => (str || "").toString().toLowerCase();
  const safeArray = (arr) => (Array.isArray(arr) ? arr : []);

  // Safe feedback field access
  const getFeedbackField = (feedback, field, fallback = "N/A") => {
    if (!feedback || typeof feedback !== "object") return fallback;
    return feedback[field] ?? fallback;
  };

  const getTypeIcon = (type) => {
    const safeType = type || "suggestion";

    const iconConfig = {
      bug: { icon: Bug, color: "text-red-500 bg-red-100" },
      suggestion: { icon: Lightbulb, color: "text-blue-500 bg-blue-100" },
      complaint: { icon: AlertTriangle, color: "text-amber-500 bg-amber-100" },
      compliment: { icon: Heart, color: "text-green-500 bg-green-100" },
    };

    const config = iconConfig[safeType] || iconConfig.suggestion;
    const Icon = config.icon;

    return (
      <div className={`p-2 rounded-lg ${config.color}`}>
        <Icon className="w-5 h-5" />
      </div>
    );
  };

  const getTypeBadge = (type) => {
    const safeType = type || "suggestion";

    const typeConfig = {
      bug: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Bug Report",
      },
      suggestion: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Suggestion",
      },
      complaint: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        label: "Complaint",
      },
      compliment: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Compliment",
      },
    };

    const config = typeConfig[safeType] || typeConfig.suggestion;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const safeStatus = status || "new";

    const statusConfig = {
      new: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "New" },
      "in-progress": {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        label: "In Progress",
      },
      resolved: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Resolved",
      },
      planned: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        label: "Planned",
      },
    };

    const config = statusConfig[safeStatus] || statusConfig.new;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const safePriority = priority || "medium";

    const priorityConfig = {
      high: { color: "bg-red-100 text-red-800 border-red-200", label: "High" },
      medium: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        label: "Medium",
      },
      low: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Low",
      },
    };

    const config = priorityConfig[safePriority] || priorityConfig.medium;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  // Safe feedback filtering
  const filteredFeedbacks = useMemo(() => {
    try {
      return safeArray(feedbacks).filter((feedback) => {
        if (!feedback || typeof feedback !== "object") return false;

        const searchLower = safeString(searchTerm);
        const matchesSearch =
          safeString(feedback.message).includes(searchLower) ||
          safeString(feedback.userName).includes(searchLower) ||
          safeString(feedback.userEmail).includes(searchLower);

        const matchesCategory =
          categoryFilter === "all" || feedback.type === categoryFilter;

        const matchesStatus =
          statusFilter === "all" || feedback.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
      });
    } catch (err) {
      console.error("Error filtering feedback:", err);
      return [];
    }
  }, [feedbacks, searchTerm, categoryFilter, statusFilter]);

  // Safe stats calculation
  const stats = useMemo(() => {
    try {
      const defaultStats = {
        total: 0,
        bug: 0,
        suggestion: 0,
        complaint: 0,
        compliment: 0,
        new: 0,
        resolved: 0,
      };

      return safeArray(feedbacks).reduce((acc, feedback) => {
        if (!feedback) return acc;

        return {
          total: acc.total + 1,
          bug: acc.bug + (feedback.type === "bug" ? 1 : 0),
          suggestion: acc.suggestion + (feedback.type === "suggestion" ? 1 : 0),
          complaint: acc.complaint + (feedback.type === "complaint" ? 1 : 0),
          compliment: acc.compliment + (feedback.type === "compliment" ? 1 : 0),
          new: acc.new + (feedback.status === "new" ? 1 : 0),
          resolved: acc.resolved + (feedback.status === "resolved" ? 1 : 0),
        };
      }, defaultStats);
    } catch (err) {
      console.error("Error calculating stats:", err);
      return {
        total: 0,
        bug: 0,
        suggestion: 0,
        complaint: 0,
        compliment: 0,
        new: 0,
        resolved: 0,
      };
    }
  }, [feedbacks]);

  // Safe date formatting
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "No date";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Invalid date";
    }
  };

  const getTimeAgo = (dateString) => {
    try {
      if (!dateString) return "Unknown time";

      const date = new Date(dateString);
      const now = new Date();

      // Check if date is valid
      if (isNaN(date.getTime())) return "Invalid date";

      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

      if (diffInHours < 1) return "Just now";
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
      return formatDate(dateString);
    } catch (err) {
      console.error("Error calculating time ago:", err);
      return "Unknown time";
    }
  };

  // Safe delete handler
  const handleDeleteFeedback = async (feedbackId) => {
    if (!feedbackId) {
      console.error("No feedback ID provided for deletion");
      return;
    }

    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        // await deleteFeedback(feedbackId); // Uncomment when you have deleteFeedback service
        setFeedbacks((prev) =>
          prev.filter((feedback) => feedback && feedback._id !== feedbackId)
        );
      } catch (err) {
        console.error("Error deleting feedback:", err);
        alert("Failed to delete feedback. Please try again.");
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                User Feedback
              </h1>
              <p className="text-slate-600">
                Manage and respond to user feedback, suggestions, and bug
                reports
              </p>
            </div>
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors w-fit">
              <MessageSquare className="w-5 h-5" />
              Send Broadcast
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3 mb-8">
          {[
            { label: "Total", value: stats.total, color: "text-slate-800" },
            { label: "Bugs", value: stats.bug, color: "text-red-600" },
            {
              label: "Suggestions",
              value: stats.suggestion,
              color: "text-blue-600",
            },
            {
              label: "Complaints",
              value: stats.complaint,
              color: "text-amber-600",
            },
            {
              label: "Compliments",
              value: stats.compliment,
              color: "text-green-600",
            },
            { label: "New", value: stats.new, color: "text-blue-600" },
            {
              label: "Resolved",
              value: stats.resolved,
              color: "text-green-600",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm border border-slate-200"
            >
              <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-slate-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search feedback messages, user names, emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="bug">Bug Reports</option>
                <option value="suggestion">Suggestions</option>
                <option value="complaint">Complaints</option>
                <option value="compliment">Compliments</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="planned">Planned</option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
                className="px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 justify-center"
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-4 sm:space-y-6">
          {filteredFeedbacks.map((feedback) => (
            <div
              key={getFeedbackField(feedback, "_id", "unknown")}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Left Section - User and Message */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 sm:gap-4">
                    {getTypeIcon(getFeedbackField(feedback, "type"))}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <span className="font-semibold text-slate-800 truncate">
                            {getFeedbackField(
                              feedback,
                              "userName",
                              "Unknown User"
                            )}
                          </span>
                          <span className="text-slate-500 hidden sm:inline">
                            •
                          </span>
                          <span className="text-slate-500 text-sm truncate">
                            {getFeedbackField(
                              feedback,
                              "userEmail",
                              "No email"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {getTypeBadge(getFeedbackField(feedback, "type"))}
                          {getStatusBadge(getFeedbackField(feedback, "status"))}
                          {getPriorityBadge(
                            getFeedbackField(feedback, "priority")
                          )}
                        </div>
                      </div>

                      <p className="text-slate-700 leading-relaxed mb-4 text-sm sm:text-base">
                        {getFeedbackField(feedback, "message", "No message")}
                      </p>

                      <div className="flex items-center gap-3 sm:gap-4 text-sm text-slate-500 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(getFeedbackField(feedback, "createdAt"))}
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <span>
                          {getTimeAgo(getFeedbackField(feedback, "createdAt"))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:gap-2">
                  <button
                    className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Mark as Resolved"
                  >
                    <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    className="p-2 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                    title="Reply to User"
                  >
                    <Reply className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteFeedback(getFeedbackField(feedback, "_id"))
                    }
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Feedback"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFeedbacks.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              No feedback found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Category Summary */}
        {stats.total > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mt-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Feedback by Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  type: "bug",
                  label: "Bug Reports",
                  count: stats.bug,
                  color: "bg-red-500",
                },
                {
                  type: "suggestion",
                  label: "Suggestions",
                  count: stats.suggestion,
                  color: "bg-blue-500",
                },
                {
                  type: "complaint",
                  label: "Complaints",
                  count: stats.complaint,
                  color: "bg-amber-500",
                },
                {
                  type: "compliment",
                  label: "Compliments",
                  count: stats.compliment,
                  color: "bg-green-500",
                },
              ].map((category) => (
                <div
                  key={category.type}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
                  onClick={() => setCategoryFilter(category.type)}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-800 truncate">
                        {category.label}
                      </h3>
                      <p className="text-slate-600 text-sm mt-1">
                        {category.count} feedback items
                      </p>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${category.color} flex-shrink-0`}
                    ></div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                    <div
                      className={`h-2 rounded-full ${category.color}`}
                      style={{
                        width:
                          stats.total > 0
                            ? `${(category.count / stats.total) * 100}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedBack;
