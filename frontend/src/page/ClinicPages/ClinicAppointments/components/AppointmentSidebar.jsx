import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Stethoscope,
  Video,
  Building,
  MapPin,
  FileText,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { formatDate, useTime } from "../../../../utils/date";

const AppointmentSidebar = ({ isOpen, onClose, appointment }) => {
  // Check if this is a reschedule request
  const isReschedule = appointment?.isReschedule;
  const rescheduleReason = appointment?.cancellationReason;

  // Status color mapping
  const statusColors = {
    pending: "text-amber-600 bg-amber-50 border-amber-200",
    scheduled: "text-blue-600 bg-blue-50 border-blue-200",
    completed: "text-green-600 bg-green-50 border-green-200",
    cancelled: "text-red-600 bg-red-50 border-red-200",
    accepted: "text-emerald-600 bg-emerald-50 border-emerald-200",
    rejected: "text-rose-600 bg-rose-50 border-rose-200",
  };

  return (
    <AnimatePresence>
      {isOpen && appointment && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Appointment
                  </h2>
                  <p className="text-slate-500 text-sm">
                    ID: #{appointment._id?.slice(-6)}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-80px)]">
              {/* Status & Reschedule Badge */}
              <div className="flex items-center justify-between">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium ${
                    statusColors[appointment.status] ||
                    "text-slate-600 bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                  <span className="capitalize">{appointment.status}</span>
                </div>

                {isReschedule && (
                  <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-2 rounded-xl text-sm font-medium">
                    <RotateCcw className="w-4 h-4" />
                    <span>Rescheduled</span>
                  </div>
                )}
              </div>

              {/* Reschedule Alert */}
              {isReschedule && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-500 p-2 rounded-xl">
                      <RotateCcw className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-800 text-sm mb-1">
                        Reschedule Request
                      </h4>
                      <p className="text-orange-700 text-sm mb-3">
                        Patient requested a new appointment time
                      </p>
                      {rescheduleReason && (
                        <div className="bg-white/80 rounded-xl p-3 border border-orange-100">
                          <p className="text-xs text-orange-600 font-medium mb-1">
                            📝 Reason for reschedule:
                          </p>
                          <p className="text-sm text-orange-800">
                            {rescheduleReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Appointment Timeline */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Appointment Schedule
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">Date</p>
                        <p className="text-sm text-slate-500">
                          {formatDate(appointment.date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">Time</p>
                        <p className="text-sm text-slate-500">
                          {useTime(appointment.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Information */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-500" />
                  Patient Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <User className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-700">
                        {appointment.patientId.name}
                      </p>
                      <p className="text-sm text-slate-500">Patient</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-700">
                        {appointment.patientId.phone}
                      </p>
                      <p className="text-sm text-slate-500">Phone</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-700">
                        {appointment.patientId.email}
                      </p>
                      <p className="text-sm text-slate-500">Email</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor & Consultation Details */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-cyan-500" />
                  Consultation Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <User className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-700">
                        {appointment.doctorId.name}
                      </p>
                      <p className="text-sm text-slate-500">Doctor</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Stethoscope className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-700 capitalize">
                        {appointment.type}
                      </p>
                      <p className="text-sm text-slate-500">Appointment Type</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    {appointment.bookingType === "online" ? (
                      <Video className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Building className="w-4 h-4 text-green-500" />
                    )}
                    <div>
                      <p className="font-medium text-slate-700 capitalize">
                        {appointment.bookingType === "online"
                          ? "Online Consultation"
                          : "Walk-in Visit"}
                      </p>
                      <p className="text-sm text-slate-500">Booking Type</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-500" />
                  Additional Info
                </h3>
                <div className="text-sm text-slate-600 space-y-2">
                  <p>
                    📍 Created on{" "}
                    {new Date(appointment.createdAt).toLocaleDateString()}
                  </p>
                  {appointment.notes && (
                    <div className="bg-white/50 rounded-xl p-3 mt-2">
                      <p className="font-medium text-slate-700 text-sm mb-1">
                        Notes:
                      </p>
                      <p className="text-slate-600">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AppointmentSidebar;
