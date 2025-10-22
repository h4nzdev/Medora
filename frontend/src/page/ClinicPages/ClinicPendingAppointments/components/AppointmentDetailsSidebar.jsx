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
              <h2 className="text-xl font-semibold text-slate-800">
                Appointment Details
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-140px)]">
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
                    <span>
                      {formatDate(appointment.date)}
                    </span>
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

              {/* Status */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Current Status
                </h3>
                <span
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    appointment.status === "pending"
                      ? "text-amber-700 bg-amber-50 border border-amber-200"
                      : "text-slate-700 bg-slate-100"
                  }`}
                >
                  {appointment.status === "pending" && (
                    <Clock className="w-4 h-4" />
                  )}
                  <span className="capitalize">{appointment.status}</span>
                </span>
              </div>

              {/* Notes/Additional Information - if available */}
              {appointment.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Additional Notes
                  </h3>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-lg">
                    {appointment.notes}
                  </p>
                </div>
              )}
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
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => onReject(appointment._id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AppointmentDetailsSidebar;
