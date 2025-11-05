import React, { useState, useMemo, useEffect, useContext } from "react";
import {
  Search,
  Filter,
  MessageSquare,
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
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  RefreshCw,
  Shield,
} from "lucide-react";
import {
  getAllFeedback,
  deleteFeedback,
  addAdminResponse,
  addAdminReaction,
  updateFeedbackStatus,
} from "../../../services/feedbackService";
import { toast } from "sonner";
import { AuthContext } from "../../../context/AuthContext"; // Import AuthContext
import { useNavigate } from "react-router-dom"; // Import navigate for redirect
import { createNotification } from "../../../services/notificationService";

const AdminFeedback = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  // Get user and role from AuthContext
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check if user is admin
  const isAdmin = user?.role === "Admin";

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/"); // Redirect to home or login page
      return;
    }
  }, [isAdmin, navigate]);

  // Fetch feedback data - only if admin
  useEffect(() => {
    if (isAdmin) {
      fetchFeedbacks();
    }
  }, [isAdmin]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const feedbacksData = await getAllFeedback();

      if (Array.isArray(feedbacksData)) {
        setFeedbacks(feedbacksData);
        console.log(feedbacksData);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setError("Failed to load feedback. Please try refreshing.");
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  // Safe data access helpers
  const safeString = (str) => (str || "").toString().toLowerCase();
  const safeArray = (arr) => (Array.isArray(arr) ? arr : []);

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
    const safeStatus = status || "pending";
    const statusConfig = {
      pending: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Pending",
      },
      reviewed: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        label: "Reviewed",
      },
      resolved: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Resolved",
      },
      closed: {
        color: "bg-slate-100 text-slate-800 border-slate-200",
        label: "Closed",
      },
    };
    const config = statusConfig[safeStatus] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  // Filter feedbacks
  const filteredFeedbacks = useMemo(() => {
    try {
      return safeArray(feedbacks).filter((feedback) => {
        if (!feedback || typeof feedback !== "object") return false;

        const searchLower = safeString(searchTerm);
        const matchesSearch =
          safeString(feedback.message).includes(searchLower) ||
          safeString(feedback.userId?.name).includes(searchLower) ||
          safeString(feedback.userId?.email).includes(searchLower);

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

  // Calculate stats
  const stats = useMemo(() => {
    try {
      const defaultStats = {
        total: 0,
        bug: 0,
        suggestion: 0,
        complaint: 0,
        compliment: 0,
        pending: 0,
        reviewed: 0,
        resolved: 0,
        closed: 0,
      };

      return safeArray(feedbacks).reduce((acc, feedback) => {
        if (!feedback) return acc;
        return {
          total: acc.total + 1,
          bug: acc.bug + (feedback.type === "bug" ? 1 : 0),
          suggestion: acc.suggestion + (feedback.type === "suggestion" ? 1 : 0),
          complaint: acc.complaint + (feedback.type === "complaint" ? 1 : 0),
          compliment: acc.compliment + (feedback.type === "compliment" ? 1 : 0),
          pending: acc.pending + (feedback.status === "pending" ? 1 : 0),
          reviewed: acc.reviewed + (feedback.status === "reviewed" ? 1 : 0),
          resolved: acc.resolved + (feedback.status === "resolved" ? 1 : 0),
          closed: acc.closed + (feedback.status === "closed" ? 1 : 0),
        };
      }, defaultStats);
    } catch (err) {
      console.error("Error calculating stats:", err);
      return defaultStats;
    }
  }, [feedbacks]);

  // Date formatting
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
      return "Invalid date";
    }
  };

  // Action handlers with admin check
  const handleDeleteFeedback = async (feedbackId) => {
    if (!feedbackId || !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await deleteFeedback(feedbackId);
        setFeedbacks((prev) =>
          prev.filter((feedback) => feedback._id !== feedbackId)
        );
        toast.success("Feedback deleted successfully");
      } catch (err) {
        console.error("Error deleting feedback:", err);
        toast.error("Failed to delete feedback");
      }
    }
  };

  const handleAddResponse = async (feedbackId) => {
    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      return;
    }

    if (!responseMessage.trim()) {
      toast.error("Please enter a response message");
      return;
    }

    try {
      await addAdminResponse(feedbackId, responseMessage);

      if (selectedFeedback && selectedFeedback.userId) {
        try {
          await createNotification({
            recipientId: selectedFeedback.userId,
            recipientType: selectedFeedback.userType,
            systemFeedback: responseMessage,
            message: "An Admin has responded to your feedback.",
            type: "system",
          });
        } catch (error) {
          console.error("Failed to create notification: ", error);
          toast.error("Failed to create notification");
        }
      }

      await fetchFeedbacks();
      setShowResponseModal(false);
      setResponseMessage("");
      setSelectedFeedback(null);
      toast.success("Response sent successfully");
    } catch (err) {
      console.error("Error sending response:", err);
      toast.error("Failed to send response");
    }
  };

  const handleUpdateStatus = async (feedbackId, newStatus) => {
    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      return;
    }

    try {
      await updateFeedbackStatus(feedbackId, newStatus);
      await fetchFeedbacks();
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    }
  };

  const handleAddReaction = async (feedbackId, reaction) => {
    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      return;
    }

    try {
      await addAdminReaction(feedbackId, reaction);
      await fetchFeedbacks();
      toast.success("Reaction added");
    } catch (err) {
      console.error("Error adding reaction:", err);
      toast.error("Failed to add reaction");
    }
  };

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Access Denied
          </h2>
          <p className="text-slate-600">
            Admin privileges required to access this page.
          </p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      {/* Header with Admin Badge */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                User Feedback
              </h1>
              <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium border border-cyan-200">
                Admin Access
              </span>
            </div>
            <p className="text-slate-600">
              Manage and respond to user feedback, suggestions, and bug reports
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchFeedbacks}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {/* Error Banner */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-8">
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

      {/* Status Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Pending", value: stats.pending, color: "text-blue-600" },
          { label: "Reviewed", value: stats.reviewed, color: "text-amber-600" },
          { label: "Resolved", value: stats.resolved, color: "text-green-600" },
          { label: "Closed", value: stats.closed, color: "text-slate-600" },
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
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
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
            key={feedback._id}
            className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Left Section - User and Message */}
              <div className="flex-1">
                <div className="flex items-start gap-3 sm:gap-4">
                  {getTypeIcon(feedback.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">
                          {feedback.userId?.name || "Anonymous User"}
                        </span>
                        <span className="text-slate-500 hidden sm:inline">
                          •
                        </span>
                        <span className="text-slate-500 text-sm truncate">
                          {feedback.userId?.email || "No email"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getTypeBadge(feedback.type)}
                        {getStatusBadge(feedback.status)}
                      </div>
                    </div>

                    <p className="text-slate-700 leading-relaxed mb-4 text-sm sm:text-base">
                      {feedback.message}
                    </p>

                    {/* Admin Response */}
                    {feedback.adminResponse && (
                      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-cyan-800">
                            Admin Response:
                          </span>
                          <span className="text-cyan-600 text-sm">
                            {formatDate(feedback.adminResponse.respondedAt)}
                          </span>
                        </div>
                        <p className="text-cyan-700">
                          {feedback.adminResponse.message}
                        </p>
                      </div>
                    )}

                    {/* Admin Reaction */}
                    {feedback.adminReaction && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-slate-600 text-sm">
                          Admin reaction:
                        </span>
                        {feedback.adminReaction === "thumbs_up" ? (
                          <ThumbsUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <ThumbsDown className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-3 sm:gap-4 text-sm text-slate-500 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(feedback.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:gap-2">
                <button
                  onClick={() => handleAddReaction(feedback._id, "thumbs_up")}
                  className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Thumbs Up"
                >
                  <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => handleAddReaction(feedback._id, "thumbs_down")}
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Thumbs Down"
                >
                  <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedFeedback(feedback);
                    setShowResponseModal(true);
                  }}
                  className="p-2 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                  title="Reply to User"
                >
                  <Reply className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => handleDeleteFeedback(feedback._id)}
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Feedback"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Status Update Buttons */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
              {["pending", "reviewed", "resolved", "closed"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleUpdateStatus(feedback._id, status)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    feedback.status === status
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
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
            {feedbacks.length === 0
              ? "No feedback has been submitted yet."
              : "Try adjusting your search or filters"}
          </p>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Respond to Feedback
            </h3>
            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              placeholder="Type your response here..."
              rows="4"
              className="w-full p-3 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setResponseMessage("");
                  setSelectedFeedback(null);
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddResponse(selectedFeedback._id)}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
