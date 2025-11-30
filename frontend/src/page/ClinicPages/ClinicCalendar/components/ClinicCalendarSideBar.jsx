import React from "react";
import { motion } from "framer-motion";

import {
  Calendar as CalendarIcon,
  X,
  User,
  Clock,
  Video,
  Building,
  MapPin,
} from "lucide-react";

const ClinicCalendarSideBar = ({
  selectedDateAppointments,
  selectedDate,
  closeSidebar,
}) => {
  const formatSelectedDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <motion.div
        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 overflow-hidden auto-hide-scroll"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              Appointments for {formatSelectedDate(selectedDate)}
            </h2>
            <p className="text-slate-600 mt-1">
              {selectedDateAppointments.length} appointment
              {selectedDateAppointments.length !== 1 ? "s" : ""} scheduled
            </p>
          </div>
          <button
            onClick={closeSidebar}
            className="p-2 hover:bg-white rounded-lg transition-colors border border-slate-200"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-120px)] overflow-y-auto p-6">
          {selectedDateAppointments.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                No Appointments
              </h3>
              <p className="text-slate-500">
                No appointments scheduled for this date.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-xl">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 text-lg">
                          {appointment.patientId?.name}
                        </h3>
                        <p className="text-slate-500 text-sm">
                          Patient ID: #
                          {appointment.patientId?._id?.slice(-6) || "N/A"}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800 border border-cyan-200">
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-3 text-slate-600">
                      <Clock className="w-4 h-4 text-cyan-500" />
                      <span>
                        {appointment.time
                          ? new Date(appointment.time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Time not specified"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-slate-600">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-700 text-sm mb-2">
                        Doctor
                      </h4>
                      <p className="text-slate-600">
                        Dr.{" "}
                        {appointment.doctorId?.name || "Doctor is unavailable"}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-700 text-sm mb-2">
                        Consultation Type
                      </h4>
                      <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-sm capitalize">
                        {appointment.type || "General"}
                      </span>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <h4 className="font-semibold text-slate-700 text-sm mb-1">
                        Notes
                      </h4>
                      <p className="text-slate-600 text-sm">
                        {appointment.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center space-x-2 text-slate-500 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{appointment.clinicId?.name || "Clinic"}</span>
                    </div>

                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                        View Details
                      </button>
                      <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                        Reschedule
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ClinicCalendarSideBar;
