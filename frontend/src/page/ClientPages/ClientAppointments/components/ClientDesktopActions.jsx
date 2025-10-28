// ClientDesktopActions.jsx
import { MoreHorizontal, Edit3, RotateCcw, XCircle, Bell } from "lucide-react";
import React, { useState } from "react";
import {
  handleDelete,
  handleRescheduleAppointment,
  handleEditAppointment,
  handleSetReminder,
} from "./actionFunctions";

const ClientDesktopActions = ({ id, appointment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check status based on your schema enum
  const isCompleted = appointment?.status === "completed";
  const isCancelled = appointment?.status === "cancelled";
  const isActive = !isCompleted && !isCancelled;

  const actions = [
    {
      icon: Bell,
      label: "Set Reminder",
      loadingLabel: "Setting Reminder...",
      onClick: () => handleSetReminder(appointment),
      color: "blue",
      enabled: isActive,
    },
    {
      icon: Edit3,
      label: "Edit Details",
      loadingLabel: "Updating...",
      onClick: () =>
        handleEditAppointment(appointment, setIsLoading, setIsOpen),
      color: "cyan",
      enabled: isActive,
    },
    {
      icon: RotateCcw,
      label: "Reschedule",
      loadingLabel: "Rescheduling...",
      onClick: () =>
        handleRescheduleAppointment(appointment, setIsLoading, setIsOpen),
      color: "purple",
      enabled: isActive,
    },
    {
      icon: XCircle,
      label: "Cancel",
      loadingLabel: "Cancelling...",
      onClick: () => handleDelete(id, setIsLoading, setIsOpen),
      color: "red",
      enabled: isActive,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 hover:bg-slate-100 rounded-xl text-slate-600 transition-all"
        aria-label="More options"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 border border-slate-200">
          {actions.map((action, index) =>
            action.enabled ? (
              <button
                key={action.label}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                disabled={isLoading}
                className={`flex items-center w-full p-3 text-sm font-medium text-slate-700 hover:bg-slate-50 border-b border-slate-100 transition-colors ${
                  index === actions.length - 1 ? "border-b-0" : ""
                }`}
              >
                <action.icon className="w-4 h-4 text-slate-600 mr-3" />
                {isLoading ? action.loadingLabel : action.label}
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

export default ClientDesktopActions;
