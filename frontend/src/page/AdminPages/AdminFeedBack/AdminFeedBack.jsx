import React, { useState, useMemo } from "react";
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

const AdminFeedBack = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Static feedback data based on your schema
  const feedbacks = [
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
    {
      _id: "4",
      userId: "user4",
      userName: "Michael Tan",
      userEmail: "michael.tan@email.com",
      message:
        "I've been experiencing slow loading times on the patient dashboard, especially when viewing medical records. This needs immediate attention.",
      type: "complaint",
      createdAt: "2024-10-11T14:20:00Z",
      status: "new",
      priority: "high",
    },
    {
      _id: "5",
      userId: "user5",
      userName: "Sarah Lim",
      userEmail: "sarah.lim@email.com",
      message:
        "Could you add a feature to export medical records as PDF? This would be very helpful for insurance claims.",
      type: "suggestion",
      createdAt: "2024-10-10T11:00:00Z",
      status: "planned",
      priority: "medium",
    },
    {
      _id: "6",
      userId: "user6",
      userName: "Robert Garcia",
      userEmail: "robert.g@email.com",
      message:
        "The medication reminder notifications are not working consistently on iOS devices. Please investigate this issue.",
      type: "bug",
      createdAt: "2024-10-09T16:30:00Z",
      status: "in-progress",
      priority: "high",
    },
    {
      _id: "7",
      userId: "user7",
      userName: "Lisa Gomez",
      userEmail: "lisa.gomez@email.com",
      message:
        "I love the new UI update! The colors are soothing and the navigation is much more intuitive now. Thank you!",
      type: "compliment",
      createdAt: "2024-10-08T13:45:00Z",
      status: "resolved",
      priority: "low",
    },
    {
      _id: "8",
      userId: "user8",
      userName: "Carlos Rodriguez",
      userEmail: "carlos.r@email.com",
      message:
        "The prescription upload feature keeps failing for files larger than 2MB. This is frustrating when trying to upload lab results.",
      type: "complaint",
      createdAt: "2024-10-07T10:15:00Z",
      status: "new",
      priority: "medium",
    },
  ];

  const getTypeIcon = (type) => {
    const iconConfig = {
      bug: { icon: Bug, color: "text-red-500 bg-red-100" },
      suggestion: { icon: Lightbulb, color: "text-blue-500 bg-blue-100" },
      complaint: { icon: AlertTriangle, color: "text-amber-500 bg-amber-100" },
      compliment: { icon: Heart, color: "text-green-500 bg-green-100" },
    };

    const config = iconConfig[type] || iconConfig.suggestion;
    const Icon = config.icon;

    return (
      <div className={`p-2 rounded-lg ${config.color}`}>
        <Icon className="w-5 h-5" />
      </div>
    );
  };

  const getTypeBadge = (type) => {
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

    const config = typeConfig[type] || typeConfig.suggestion;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
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

    const config = statusConfig[status] || statusConfig.new;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
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

    const config = priorityConfig[priority] || priorityConfig.medium;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || feedback.type === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || feedback.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = useMemo(() => {
    return {
      total: feedbacks.length,
      bug: feedbacks.filter((f) => f.type === "bug").length,
      suggestion: feedbacks.filter((f) => f.type === "suggestion").length,
      complaint: feedbacks.filter((f) => f.type === "complaint").length,
      compliment: feedbacks.filter((f) => f.type === "compliment").length,
      new: feedbacks.filter((f) => f.status === "new").length,
      resolved: feedbacks.filter((f) => f.status === "resolved").length,
    };
  }, [feedbacks]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                User Feedback
              </h1>
              <p className="text-slate-600">
                Manage and respond to user feedback, suggestions, and bug
                reports
              </p>
            </div>
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors">
              <MessageSquare className="w-5 h-5" />
              Send Broadcast
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">
              {stats.total}
            </div>
            <div className="text-slate-600 text-sm">Total Feedback</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-red-600">{stats.bug}</div>
            <div className="text-slate-600 text-sm">Bug Reports</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-blue-600">
              {stats.suggestion}
            </div>
            <div className="text-slate-600 text-sm">Suggestions</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-amber-600">
              {stats.complaint}
            </div>
            <div className="text-slate-600 text-sm">Complaints</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-green-600">
              {stats.compliment}
            </div>
            <div className="text-slate-600 text-sm">Compliments</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            <div className="text-slate-600 text-sm">New</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search feedback messages, user names, emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                className="px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Filter className="w-5 h-5 text-slate-600" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-6">
          {filteredFeedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Left Section - User and Message */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    {getTypeIcon(feedback.type)}
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-500" />
                          <span className="font-semibold text-slate-800">
                            {feedback.userName}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-500 text-sm">
                            {feedback.userEmail}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTypeBadge(feedback.type)}
                          {getStatusBadge(feedback.status)}
                          {getPriorityBadge(feedback.priority)}
                        </div>
                      </div>

                      <p className="text-slate-700 leading-relaxed mb-4">
                        {feedback.message}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(feedback.createdAt)}
                        </div>
                        <span>•</span>
                        <span>{getTimeAgo(feedback.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:gap-3">
                  <button
                    className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Mark as Resolved"
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                    title="Reply to User"
                  >
                    <Reply className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Feedback"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    title="More Options"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFeedbacks.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              No feedback found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Category Summary */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mt-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Feedback by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {category.label}
                    </h3>
                    <p className="text-slate-600 text-sm mt-1">
                      {category.count} feedback items
                    </p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${category.color}`}
                  ></div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                  <div
                    className={`h-2 rounded-full ${category.color}`}
                    style={{
                      width: `${(category.count / stats.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFeedBack;
