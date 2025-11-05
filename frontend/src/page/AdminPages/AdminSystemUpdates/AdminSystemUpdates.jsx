import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Eye,
  Tag,
  Clock,
  User,
  Bell,
  RefreshCw,
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { createNotification } from "../../../services/notificationService";
import {
  createSystemUpdate,
  getAllSystemUpdates,
  deleteSystemUpdate,
  publishSystemUpdate,
  StatusTypes,
  PriorityTypes,
} from "../../../services/systemUpdate_services/systemUpdateService";

const AdminSystemUpdates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [newUpdate, setNewUpdate] = useState({
    title: "",
    description: "",
    priority: "medium",
    tags: "",
    scheduledFor: "",
  });

  // Fetch system updates on component mount
  useEffect(() => {
    fetchSystemUpdates();
  }, []);

  const fetchSystemUpdates = async () => {
    try {
      setLoading(true);
      const updatesData = await getAllSystemUpdates();
      setUpdates(updatesData);
    } catch (error) {
      console.error("Error fetching system updates:", error);
      toast.error("Failed to load system updates");
    } finally {
      setLoading(false);
    }
  };

  // Filter updates
  const filteredUpdates = useMemo(() => {
    return updates.filter((update) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        update.title.toLowerCase().includes(searchLower) ||
        update.description.toLowerCase().includes(searchLower) ||
        (update.tags &&
          update.tags.some((tag) => tag.toLowerCase().includes(searchLower)));

      const matchesStatus =
        statusFilter === "all" || update.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || update.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [updates, searchTerm, statusFilter, priorityFilter]);

  // Stats calculation
  const stats = useMemo(() => {
    return updates.reduce(
      (acc, update) => ({
        total: acc.total + 1,
        published:
          acc.published + (update.status === StatusTypes.PUBLISHED ? 1 : 0),
        scheduled:
          acc.scheduled + (update.status === StatusTypes.SCHEDULED ? 1 : 0),
        draft: acc.draft + (update.status === StatusTypes.DRAFT ? 1 : 0),
        high: acc.high + (update.priority === PriorityTypes.HIGH ? 1 : 0),
        medium: acc.medium + (update.priority === PriorityTypes.MEDIUM ? 1 : 0),
        low: acc.low + (update.priority === PriorityTypes.LOW ? 1 : 0),
      }),
      {
        total: 0,
        published: 0,
        scheduled: 0,
        draft: 0,
        high: 0,
        medium: 0,
        low: 0,
      }
    );
  }, [updates]);

  // Date formatting
  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [StatusTypes.PUBLISHED]: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        label: "Published",
      },
      [StatusTypes.SCHEDULED]: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: Clock,
        label: "Scheduled",
      },
      [StatusTypes.DRAFT]: {
        color: "bg-slate-100 text-slate-800 border-slate-200",
        icon: Edit,
        label: "Draft",
      },
    };
    const config = statusConfig[status] || statusConfig[StatusTypes.DRAFT];
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      [PriorityTypes.HIGH]: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: AlertTriangle,
        label: "High",
      },
      [PriorityTypes.MEDIUM]: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: AlertCircle,
        label: "Medium",
      },
      [PriorityTypes.LOW]: {
        color: "bg-cyan-100 text-cyan-800 border-cyan-200",
        icon: Info,
        label: "Low",
      },
    };
    const config =
      priorityConfig[priority] || priorityConfig[PriorityTypes.MEDIUM];
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  // Action handlers
  const handleCreateUpdate = async () => {
    if (!newUpdate.title.trim() || !newUpdate.description.trim()) {
      toast.error("Please fill in title and description");
      return;
    }

    try {
      const systemUpdateData = {
        title: newUpdate.title,
        description: newUpdate.description,
        priority: newUpdate.priority,
        tags: newUpdate.tags
          ? newUpdate.tags.split(",").map((tag) => tag.trim())
          : [],
        ...(newUpdate.scheduledFor && {
          scheduledFor: new Date(newUpdate.scheduledFor),
        }),
      };

      const createdUpdate = await createSystemUpdate(systemUpdateData);

      // If the update is published immediately (not scheduled), send notifications
      if (!newUpdate.scheduledFor) {
        try {
          // Create ONE system-wide notification for ALL users (clients + clinics)
          await createNotification({
            recipientType: "all",
            message: `System Update: ${newUpdate.title}`,
            systemMessage: newUpdate.description,
            type: "system",
            relatedId: createdUpdate._id,
          });

          toast.success(
            "System update created and notification sent to all users"
          );
        } catch (notificationError) {
          console.error("Failed to create notification:", notificationError);
          toast.success(
            "System update created but failed to send notification"
          );
        }
      } else {
        toast.success("System update scheduled successfully");
      }

      // Refresh the updates list
      await fetchSystemUpdates();

      // Reset form and close modal
      setShowCreateModal(false);
      setNewUpdate({
        title: "",
        description: "",
        priority: "medium",
        tags: "",
        scheduledFor: "",
      });
    } catch (error) {
      console.error("Error creating system update:", error);
      toast.error("Failed to create system update");
    }
  };

  const handleDeleteUpdate = async (id) => {
    if (window.confirm("Are you sure you want to delete this system update?")) {
      try {
        await deleteSystemUpdate(id);
        setUpdates((prev) => prev.filter((update) => update._id !== id));
        toast.success("System update deleted successfully");
      } catch (error) {
        console.error("Error deleting system update:", error);
        toast.error("Failed to delete system update");
      }
    }
  };

  const handlePublishUpdate = async (id) => {
    try {
      const publishedUpdate = await publishSystemUpdate(id);

      // Send system-wide notification when publishing
      try {
        const update = updates.find((u) => u._id === id);

        // Create ONE system-wide notification for ALL users
        await createNotification({
          recipientType: "all",
          message: `System Update: ${update.title}`,
          systemMessage: update.description,
          type: "system",
          relatedId: id,
        });

        toast.success(
          "System update published and notification sent to all users"
        );
      } catch (notificationError) {
        console.error("Failed to create notification:", notificationError);
        toast.success(
          "System update published but failed to send notification"
        );
      }

      // Update local state
      setUpdates((prev) =>
        prev.map((update) =>
          update._id === id
            ? {
                ...update,
                status: StatusTypes.PUBLISHED,
                publishedAt: new Date(),
              }
            : update
        )
      );
    } catch (error) {
      console.error("Error publishing system update:", error);
      toast.error("Failed to publish system update");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading system updates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                System Updates
              </h1>
              <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium border border-cyan-200">
                Admin Access
              </span>
            </div>
            <p className="text-slate-600">
              Manage system announcements, maintenance notices, and feature
              updates
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchSystemUpdates}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Update
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          {
            label: "Total Updates",
            value: stats.total,
            color: "text-slate-800",
          },
          {
            label: "Published",
            value: stats.published,
            color: "text-green-600",
          },
          {
            label: "Scheduled",
            value: stats.scheduled,
            color: "text-amber-600",
          },
          { label: "Drafts", value: stats.draft, color: "text-slate-600" },
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

      {/* Priority Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "High Priority", value: stats.high, color: "text-red-600" },
          {
            label: "Medium Priority",
            value: stats.medium,
            color: "text-amber-600",
          },
          { label: "Low Priority", value: stats.low, color: "text-cyan-600" },
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
              placeholder="Search updates by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value={StatusTypes.PUBLISHED}>Published</option>
              <option value={StatusTypes.SCHEDULED}>Scheduled</option>
              <option value={StatusTypes.DRAFT}>Drafts</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value={PriorityTypes.HIGH}>High</option>
              <option value={PriorityTypes.MEDIUM}>Medium</option>
              <option value={PriorityTypes.LOW}>Low</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setPriorityFilter("all");
              }}
              className="px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 justify-center"
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Updates List */}
      <div className="space-y-4 sm:space-y-6">
        {filteredUpdates.map((update) => (
          <div
            key={update._id}
            className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Left Section - Content */}
              <div className="flex-1">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 rounded-lg bg-cyan-100 text-cyan-600 flex-shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 mb-3">
                      <h3 className="font-bold text-slate-800 text-lg">
                        {update.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(update.status)}
                        {getPriorityBadge(update.priority)}
                      </div>
                    </div>

                    <p className="text-slate-700 leading-relaxed mb-4 text-sm sm:text-base whitespace-pre-line">
                      {update.description}
                    </p>

                    {/* Tags */}
                    {update.tags && update.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {update.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {update.createdBy || "Admin"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Created: {formatDate(update.createdAt)}
                      </div>
                      {update.publishedAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Published: {formatDate(update.publishedAt)}
                        </div>
                      )}
                      {update.scheduledFor && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Scheduled: {formatDate(update.scheduledFor)}
                        </div>
                      )}
                      {update.readCount > 0 && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {update.readCount} views
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:gap-2">
                <button
                  onClick={() => {
                    setSelectedUpdate(update);
                    setShowViewModal(true);
                  }}
                  className="p-2 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                {update.status === StatusTypes.DRAFT && (
                  <button
                    onClick={() => handlePublishUpdate(update._id)}
                    className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Publish Update"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteUpdate(update._id)}
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Update"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUpdates.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">
            No system updates found
          </h3>
          <p className="text-slate-500">
            {updates.length === 0
              ? "Get started by creating your first system update."
              : "Try adjusting your search or filters"}
          </p>
        </div>
      )}

      {/* Create Update Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Create System Update
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newUpdate.title}
                  onChange={(e) =>
                    setNewUpdate((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter update title..."
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={newUpdate.description}
                  onChange={(e) =>
                    setNewUpdate((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter update description..."
                  rows="4"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newUpdate.priority}
                    onChange={(e) =>
                      setNewUpdate((prev) => ({
                        ...prev,
                        priority: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value={PriorityTypes.LOW}>Low</option>
                    <option value={PriorityTypes.MEDIUM}>Medium</option>
                    <option value={PriorityTypes.HIGH}>High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Schedule For (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={newUpdate.scheduledFor}
                    onChange={(e) =>
                      setNewUpdate((prev) => ({
                        ...prev,
                        scheduledFor: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newUpdate.tags}
                  onChange={(e) =>
                    setNewUpdate((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder="feature, update, maintenance"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUpdate}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Create Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Update Modal */}
      {showViewModal && selectedUpdate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              System Update Details
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title
                </label>
                <p className="text-slate-800 text-lg font-semibold">
                  {selectedUpdate.title}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">
                  {selectedUpdate.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  {getStatusBadge(selectedUpdate.status)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Priority
                  </label>
                  {getPriorityBadge(selectedUpdate.priority)}
                </div>
              </div>
              {selectedUpdate.tags && selectedUpdate.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedUpdate.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Created By
                  </label>
                  <p className="text-slate-600">
                    {selectedUpdate.createdBy || "Admin"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Created Date
                  </label>
                  <p className="text-slate-600">
                    {formatDate(selectedUpdate.createdAt)}
                  </p>
                </div>
                {selectedUpdate.publishedAt && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Published Date
                    </label>
                    <p className="text-slate-600">
                      {formatDate(selectedUpdate.publishedAt)}
                    </p>
                  </div>
                )}
                {selectedUpdate.scheduledFor && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Scheduled For
                    </label>
                    <p className="text-slate-600">
                      {formatDate(selectedUpdate.scheduledFor)}
                    </p>
                  </div>
                )}
                {selectedUpdate.readCount > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Views
                    </label>
                    <p className="text-slate-600">{selectedUpdate.readCount}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedUpdate(null);
                }}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
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

export default AdminSystemUpdates;
