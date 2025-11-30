import React, { useContext } from "react";
import { Calendar, Clock, User, CalendarDays } from "lucide-react";
import { AppointmentContext } from "../../../context/AppointmentContext";
import { AuthContext } from "../../../context/AuthContext";
import { formatDate, useDate, useTime } from "../../../utils/date.jsx";
import { getStatusBadge } from "../../../utils/clientAppointment.jsx";

const ClientTimeline = () => {
  const { appointments } = useContext(AppointmentContext);
  const { user } = useContext(AuthContext);

  // Filter and sort appointments
  const patientAppointments = appointments
    .filter((app) => app.patientId?._id === user?._id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Stats for summary
  const stats = [
    {
      title: "Total Appointments",
      value: patientAppointments.length,
      icon: Calendar,
      color: "bg-gradient-to-br from-slate-50 to-slate-100",
      iconBg: "bg-gradient-to-br from-slate-100 to-slate-200",
      iconColor: "text-slate-600",
      textColor: "text-slate-700",
    },
    {
      title: "Completed",
      value: patientAppointments.filter((app) => app.status === "completed")
        .length,
      icon: Clock,
      color: "bg-gradient-to-br from-emerald-50 to-green-50",
      iconBg: "bg-gradient-to-br from-emerald-100 to-green-100",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-700",
    },
    {
      title: "Upcoming",
      value: patientAppointments.filter((app) =>
        ["pending", "accepted", "scheduled"].includes(app.status)
      ).length,
      icon: CalendarDays,
      color: "bg-gradient-to-br from-cyan-50 to-sky-50",
      iconBg: "bg-gradient-to-br from-cyan-100 to-sky-100",
      iconColor: "text-cyan-600",
      textColor: "text-cyan-700",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30 pb-6">
      <div className="mx-auto ">
        <header className="mb-6 sm:mb-8 md:mb-10 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight leading-tight">
                Appointment Timeline
              </h1>
              <p className="text-slate-600 mt-2 sm:mt-3 text-base sm:text-lg md:text-xl leading-relaxed">
                A chronological view of all your appointments.
              </p>
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <section className="mb-6 sm:mb-8 md:mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className={`${stat.color} backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p
                        className={`${stat.textColor} text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wider mb-2 sm:mb-3 truncate opacity-80`}
                      >
                        {stat.title}
                      </p>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 group-hover:scale-105 transition-transform duration-300">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl ${stat.iconBg} ml-2 sm:ml-3 flex-shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}
                    >
                      <IconComponent
                        className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${stat.iconColor}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Timeline Section */}
        <section>
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Your Timeline
            </h2>
            <p className="text-slate-600 mt-1 sm:mt-2 text-base sm:text-lg">
              {patientAppointments.length} appointment
              {patientAppointments.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line - hidden on very small screens */}
            <div className="hidden sm:block absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-300 to-cyan-500"></div>

            {patientAppointments.length > 0 ? (
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {patientAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="relative flex items-start"
                  >
                    {/* Timeline dot - hidden on very small screens */}
                    <div className="hidden sm:block absolute left-4 sm:left-6 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-cyan-500 to-sky-500 rounded-full border-2 sm:border-4 border-white shadow-lg z-10"></div>

                    {/* Content */}
                    <div className="sm:ml-12 md:ml-16 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 w-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex-1 min-w-0">
                          {/* Doctor and Status */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2 sm:gap-0">
                            <div className="flex items-center text-slate-900 min-w-0">
                              <User className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500 mr-2 flex-shrink-0" />
                              <span className="font-bold text-base sm:text-lg group-hover:text-cyan-600 transition-colors duration-300 truncate">
                                {appointment.doctorId?.name ||
                                  "Doctor is unavailable"}
                              </span>
                            </div>
                            <div className="flex-shrink-0">
                              {getStatusBadge(appointment.status)}
                            </div>
                          </div>

                          <p className="text-slate-600 text-sm sm:text-base mb-3 sm:mb-4 font-medium">
                            {appointment.doctorId?.specialty}
                          </p>

                          {/* Details Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                            <div className="bg-slate-50/80 rounded-lg sm:rounded-xl p-3">
                              <p className="text-slate-500 uppercase tracking-wide mb-1 font-semibold flex items-center text-xs sm:text-sm">
                                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                                Date
                              </p>
                              <p className="font-bold text-slate-700 text-sm sm:text-base">
                                {formatDate(appointment.date)}
                              </p>
                            </div>
                            <div className="bg-slate-50/80 rounded-lg sm:rounded-xl p-3">
                              <p className="text-slate-500 uppercase tracking-wide mb-1 font-semibold flex items-center text-xs sm:text-sm">
                                <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                                Time
                              </p>
                              <p className="font-bold text-slate-700 text-sm sm:text-base">
                                {useTime(appointment.date)}
                              </p>
                            </div>
                            <div className="bg-slate-50/80 rounded-lg sm:rounded-xl p-3">
                              <p className="text-slate-500 uppercase tracking-wide mb-1 font-semibold text-xs sm:text-sm">
                                Type
                              </p>
                              <p className="font-bold text-slate-700 capitalize text-sm sm:text-base">
                                {appointment.type}
                              </p>
                            </div>
                            <div className="bg-slate-50/80 rounded-lg sm:rounded-xl p-3">
                              <p className="text-slate-500 uppercase tracking-wide mb-1 font-semibold text-xs sm:text-sm">
                                Reason
                              </p>
                              <p className="font-bold text-slate-700 text-sm sm:text-base break-words">
                                {appointment.reason || "General consultation"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-6 sm:p-8 md:p-12 text-center">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 w-fit mx-auto mb-4 sm:mb-6">
                  <CalendarDays className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-700 mb-2">
                  No appointments found
                </h3>
                <p className="text-slate-500 text-base sm:text-lg">
                  Your appointment timeline is empty. Schedule a new appointment
                  to see it here.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClientTimeline;
