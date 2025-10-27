// ClientDesktopActions.jsx
import {
  MoreHorizontal,
  Calendar,
  Clock,
  Edit3,
  RotateCcw,
  XCircle,
  Bell,
} from "lucide-react";
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

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 hover:bg-gradient-to-br hover:from-slate-100 hover:to-slate-200 rounded-xl text-slate-600 hover:text-slate-800 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
        aria-label="More options"
      >
        <MoreHorizontal className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl z-50 border border-white/20 backdrop-blur-sm">
          {/* Set Reminder */}
          <button
            onClick={() => {
              handleSetReminder(appointment);
              setIsOpen(false);
            }}
            className="flex items-center px-4 py-3 text-base font-semibold text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50 hover:text-blue-700 w-full text-start border-b border-slate-200/50 transition-all duration-300 group"
          >
            <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:scale-110 transition-transform">
              <Bell className="w-4 h-4 text-blue-500" />
            </div>
            Set Reminder
          </button>

          {/* Edit Appointment */}
          <button
            onClick={() =>
              handleEditAppointment(appointment, setIsLoading, setIsOpen)
            }
            disabled={isLoading}
            className="flex items-center px-4 py-3 text-base font-semibold text-slate-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-sky-50 hover:text-cyan-700 w-full text-start border-b border-slate-200/50 transition-all duration-300 group"
          >
            <div className="p-2 bg-cyan-100 rounded-lg mr-3 group-hover:scale-110 transition-transform">
              <Edit3 className="w-4 h-4 text-cyan-500" />
            </div>
            {isLoading ? "Updating..." : "Edit Details"}
          </button>

          {/* Reschedule Appointment */}
          <button
            onClick={() =>
              handleRescheduleAppointment(appointment, setIsLoading, setIsOpen)
            }
            disabled={isLoading}
            className="flex items-center px-4 py-3 text-base font-semibold text-slate-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-50 hover:text-purple-700 w-full text-start border-b border-slate-200/50 transition-all duration-300 group"
          >
            <div className="p-2 bg-purple-100 rounded-lg mr-3 group-hover:scale-110 transition-transform">
              <RotateCcw className="w-4 h-4 text-purple-500" />
            </div>
            {isLoading ? "Rescheduling..." : "Reschedule"}
          </button>

          {/* Cancel Appointment */}
          <button
            onClick={() => handleDelete(id, setIsLoading, setIsOpen)}
            disabled={isLoading}
            className="flex items-center px-4 py-3 text-base font-semibold text-slate-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-50 hover:text-red-700 w-full text-start transition-all duration-300 group"
          >
            <div className="p-2 bg-red-100 rounded-lg mr-3 group-hover:scale-110 transition-transform">
              <XCircle className="w-4 h-4 text-red-500" />
            </div>
            {isLoading ? "Cancelling..." : "Cancel"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientDesktopActions;
