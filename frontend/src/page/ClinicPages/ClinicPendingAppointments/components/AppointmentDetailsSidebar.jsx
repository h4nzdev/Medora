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
  CheckCircle,
  XCircle,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { formatDate, useTime } from "../../../../utils/date";

const AppointmentDetailsSidebar = ({
  isOpen,
  onClose,
  appointment,
  onApprove,
  onReject,
  loadingStates,
}) => {
  // Check if this is a reschedule request
  const isReschedule = appointment?.isReschedule;
  const rescheduleReason = appointment?.cancellationReason;

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
            {/* Header with Reschedule Badge */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-slate-800">
                  Appointment Details
                </h2>
                {isReschedule && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reschedule</span>
                  </motion.div>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-140px)]">
              {/* RESCHEDULE ALERT - Minimal but eye-catching */}
              {isReschedule && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-orange-50 border border-orange-200 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <RotateCcw className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-800 text-sm mb-1">
                        Reschedule Request
                      </h4>
                      <p className="text-orange-700 text-sm mb-2">
                        Patient requested a new time slot
                      </p>
                      {rescheduleReason && (
                        <div className="bg-white rounded-lg p-2 border border-orange-100">
                          <p className="text-xs text-orange-600 font-medium mb-1">
                            Reason:
                          </p>
                          <p className="text-xs text-orange-700">
                            {rescheduleReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Patient Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-slate-700">
                      {appointment.patientId.name}
                    </p>
                    <p className="text-sm text-slate-500">Patient</p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span>{appointment.patientId.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span>{appointment.patientId.email}</span>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  Appointment Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>{useTime(appointment.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Stethoscope className="w-4 h-4" />
                    <span>{appointment.doctorId.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    {appointment.bookingType === "online" ? (
                      <Video className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Building className="w-4 h-4 text-green-500" />
                    )}
                    <span className="capitalize">
                      {appointment.bookingType} Consultation
                    </span>
                  </div>
                </div>
              </div>

              {/* Appointment Type */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Consultation Type
                </h3>
                <span className="inline-block bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm capitalize">
                  {appointment.type}
                </span>
              </div>
            </div>

            {/* Footer with Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200 bg-white">
              <div className="flex gap-3">
                {loadingStates[appointment._id] ? (
                  <div className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                    <span className="text-sm text-slate-600">
                      Processing...
                    </span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => onApprove(appointment._id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
                        isReschedule
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {isReschedule ? "Approve New Time" : "Approve"}
                    </button>
                    <button
                      onClick={() => onReject(appointment._id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
                        isReschedule
                          ? "bg-orange-500 text-white hover:bg-orange-600"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      {isReschedule ? "Keep Original" : "Reject"}
                    </button>
                  </>
                )}
              </div>

              {/* Micro UX Enhancement */}
              {isReschedule && (
                <p className="text-xs text-slate-500 text-center mt-2">
                  Approve new time or keep original schedule
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AppointmentDetailsSidebar;
