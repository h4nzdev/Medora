import React, { useState } from "react";
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";

const AppointmentActions = ({
  appointmentId,
  onComplete,
  onCancel,
  onDelete,
  onView,
  status,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (action) => {
    if (action) {
      action(appointmentId);
    }
    setIsOpen(false);
  };

  // Status checks
  const isCompleted = status === "completed";
  const isCancelled = status === "cancelled";
  const isActive = !isCompleted && !isCancelled;

  const actions = [
    {
      icon: Eye,
      label: "View Details",
      onClick: onView,
      color: "blue",
      enabled: true, // Always enabled
    },
    {
      icon: CheckCircle,
      label: "Mark Complete",
      onClick: onComplete,
      color: "green",
      enabled: isActive && status !== "pending",
    },
    {
      icon: XCircle,
      label: "Cancel",
      onClick: onCancel,
      color: "orange",
      enabled: isActive,
    },
    {
      icon: Trash2,
      label: "Delete",
      onClick: onDelete,
      color: "red",
      enabled: true, // Always enabled
    },
  ];

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        onClick={handleToggle}
        className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-all duration-200 hover:scale-105"
        aria-label="More options"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <MoreHorizontal className="w-5 h-5" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-50 border border-slate-200/50 backdrop-blur-sm">
          {actions.map((action, index) =>
            action.enabled ? (
              <button
                key={action.label}
                onClick={() => handleAction(action.onClick)}
                disabled={isLoading}
                className={`flex items-center w-full p-3 text-sm font-medium text-slate-700 hover:bg-slate-50 border-b border-slate-100 transition-all duration-200 ${
                  index === actions.length - 1 ? "border-b-0" : ""
                } ${
                  action.color === "red"
                    ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                    : action.color === "orange"
                    ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    : action.color === "green"
                    ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                    : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                }`}
              >
                <action.icon
                  className={`w-4 h-4 mr-3 ${
                    action.color === "red"
                      ? "text-red-500"
                      : action.color === "orange"
                      ? "text-orange-500"
                      : action.color === "green"
                      ? "text-green-500"
                      : "text-blue-500"
                  }`}
                />
                {isLoading ? "Processing..." : action.label}
              </button>
            ) : (
              <div
                key={action.label}
                className="flex items-center w-full p-3 text-sm font-medium text-slate-400 border-b border-slate-100 cursor-not-allowed"
              >
                <action.icon className="w-4 h-4 text-slate-300 mr-3" />
                {action.label}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentActions;
