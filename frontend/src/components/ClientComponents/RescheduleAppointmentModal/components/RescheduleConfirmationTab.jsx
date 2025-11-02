"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  ChevronLeft,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

const RescheduleConfirmationTab = ({
  formData,
  setFormData,
  prevTab,
  originalAppointment,
}) => {
  const [selectedReason, setSelectedReason] = useState("");

  const handleReasonChange = (e) => {
    const reason = e.target.value;
    setSelectedReason(reason);
    setFormData((prev) => ({ ...prev, cancellationReason: reason }));
  };

  // Simple date/time formatting for mobile
  const formatMobileDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatMobileTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const newAppointmentDateTime = new Date(
    `${formData.date.toISOString().split("T")[0]}T${formData.time}`
  );

  const originalDate = formatMobileDate(originalAppointment.date);
  const originalTime = formatMobileTime(originalAppointment.date);
  const newDate = formatMobileDate(newAppointmentDateTime);
  const newTime = formatMobileTime(newAppointmentDateTime);

  const hasDateChanged = originalDate !== newDate;
  const hasTimeChanged = originalTime !== newTime;

  const reasonOptions = [
    { value: "", label: "Select reason...", disabled: true },
    { value: "Schedule conflict", label: "Schedule conflict" },
    { value: "Emergency", label: "Emergency" },
    { value: "Personal reasons", label: "Personal reasons" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className="space-y-4 max-h-[75vh] overflow-y-auto">
      {/* Compact Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">Confirm Changes</h3>
        <p className="text-gray-500 text-sm mt-1">Review your new schedule</p>
      </div>

      {/* Compact Comparison - Side by Side */}
      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <div className="flex items-center justify-between">
          {/* Original */}
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <AlertCircle className="w-3 h-3 text-gray-500" />
              <span className="text-xs font-medium text-gray-600">
                Original
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-700">{originalDate}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-700">{originalTime}</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="px-2">
            <ArrowRight className="w-4 h-4 text-orange-500" />
          </div>

          {/* New */}
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Calendar className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-medium text-orange-600">New</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3 text-orange-400" />
                <span
                  className={`text-sm font-medium ${
                    hasDateChanged ? "text-orange-700" : "text-gray-700"
                  }`}
                >
                  {newDate}
                </span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-orange-400" />
                <span
                  className={`text-sm font-medium ${
                    hasTimeChanged ? "text-orange-700" : "text-gray-700"
                  }`}
                >
                  {newTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Info - Compact */}
        <div className="mt-3 pt-3 border-t border-gray-100 text-center">
          <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
            <User className="w-3 h-3" />
            <span>{originalAppointment.doctorId?.name}</span>
          </div>
        </div>
      </div>

      {/* Changes Badge */}
      {(hasDateChanged || hasTimeChanged) && (
        <div className="bg-orange-50 rounded-lg p-2 border border-orange-200">
          <p className="text-orange-700 text-xs text-center font-medium">
            {hasDateChanged && hasTimeChanged && "📅 Date & Time changed"}
            {hasDateChanged && !hasTimeChanged && "📅 Date changed"}
            {!hasDateChanged && hasTimeChanged && "⏰ Time changed"}
          </p>
        </div>
      )}

      {/* Reason Selection - Compact */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Why reschedule? *
        </label>
        <select
          value={selectedReason}
          onChange={handleReasonChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          required
        >
          {reasonOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Note */}
      <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
        <p className="text-blue-700 text-xs text-center">
          📋 Doctor will confirm your new schedule
        </p>
      </div>

      {/* Navigation - Compact */}
      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={prevTab}
          className="flex items-center gap-1 px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <ChevronLeft className="w-3 h-3" />
          Back
        </button>

        {!selectedReason && (
          <div className="flex items-center">
            <span className="text-orange-600 text-xs">
              Select reason to continue
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RescheduleConfirmationTab;
