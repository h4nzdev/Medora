import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

const ClientTimeline = () => {
  const [selectedMonth, setSelectedMonth] = useState("2025-09");

  // Sample appointment data based on your structure
  const appointments = [
    {
      id: "68d633511b1ecce304259480",
      date: "2025-09-26T09:00:00.000+00:00",
      status: "completed",
      type: "follow-up",
      bookingType: "walk-in",
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      createdAt: "2025-09-26T06:31:45.569+00:00",
    },
    {
      id: "68d633511b1ecce304259481",
      date: "2025-09-24T14:30:00.000+00:00",
      status: "completed",
      type: "consultation",
      bookingType: "online",
      doctorName: "Dr. Michael Chen",
      specialty: "Dermatology",
      createdAt: "2025-09-24T10:15:32.123+00:00",
    },
    {
      id: "68d633511b1ecce304259482",
      date: "2025-09-20T11:15:00.000+00:00",
      status: "completed",
      type: "check-up",
      bookingType: "online",
      doctorName: "Dr. Emily Rodriguez",
      specialty: "General Medicine",
      createdAt: "2025-09-20T08:45:18.456+00:00",
    },
    {
      id: "68d633511b1ecce304259483",
      date: "2025-09-15T16:45:00.000+00:00",
      status: "completed",
      type: "consultation",
      bookingType: "walk-in",
      doctorName: "Dr. David Kim",
      specialty: "Orthopedics",
      createdAt: "2025-09-15T13:22:41.789+00:00",
    },
    {
      id: "68d633511b1ecce304259484",
      date: "2025-09-10T10:30:00.000+00:00",
      status: "completed",
      type: "follow-up",
      bookingType: "online",
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      createdAt: "2025-09-10T07:18:25.321+00:00",
    },
    {
      id: "68d633511b1ecce304259485",
      date: "2025-08-28T13:20:00.000+00:00",
      status: "completed",
      type: "consultation",
      bookingType: "walk-in",
      doctorName: "Dr. Michael Chen",
      specialty: "Dermatology",
      createdAt: "2025-08-28T09:45:12.654+00:00",
    },
    {
      id: "68d633511b1ecce304259486",
      date: "2025-08-22T15:00:00.000+00:00",
      status: "completed",
      type: "check-up",
      bookingType: "online",
      doctorName: "Dr. Emily Rodriguez",
      specialty: "General Medicine",
      createdAt: "2025-08-22T11:30:33.987+00:00",
    },
  ];

  // Filter appointments based on selected month
  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const appointmentMonth = `${appointmentDate.getFullYear()}-${String(
      appointmentDate.getMonth() + 1
    ).padStart(2, "0")}`;
    return appointmentMonth === selectedMonth;
  });

  // Sort appointments by date (most recent first)
  const sortedAppointments = filteredAppointments.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200";
      case "scheduled":
        return "bg-gradient-to-r from-cyan-100 to-sky-100 text-cyan-700 border border-cyan-200";
      case "cancelled":
        return "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200";
      default:
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-200";
    }
  };

  const getBookingTypeIcon = (bookingType) => {
    return bookingType === "online" ? "💻" : "🏥";
  };

  const months = [
    { value: "2025-09", label: "September 2025" },
    { value: "2025-08", label: "August 2025" },
    { value: "2025-07", label: "July 2025" },
    { value: "2025-06", label: "June 2025" },
  ];

  // Stats for summary
  const stats = [
    {
      title: "Total Appointments",
      value: sortedAppointments.length,
      icon: Calendar,
      color: "bg-gradient-to-br from-slate-50 to-slate-100",
      iconBg: "bg-gradient-to-br from-slate-100 to-slate-200",
      iconColor: "text-slate-600",
      textColor: "text-slate-700",
    },
    {
      title: "Online Bookings",
      value: sortedAppointments.filter((app) => app.bookingType === "online")
        .length,
      icon: Clock,
      color: "bg-gradient-to-br from-cyan-50 to-sky-50",
      iconBg: "bg-gradient-to-br from-cyan-100 to-sky-100",
      iconColor: "text-cyan-600",
      textColor: "text-cyan-700",
    },
    {
      title: "Walk-in Visits",
      value: sortedAppointments.filter((app) => app.bookingType === "walk-in")
        .length,
      icon: CheckCircle,
      color: "bg-gradient-to-br from-emerald-50 to-green-50",
      iconBg: "bg-gradient-to-br from-emerald-100 to-green-100",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-700",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30 pb-6">
      <div className="mx-auto">
        <header className="mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
                Patient Timeline
              </h1>
              <p className="text-slate-600 mt-3 text-lg sm:text-xl leading-relaxed">
                View your appointment history and timeline.
              </p>
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <section className="mb-8 md:mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className={`${stat.color} backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p
                        className={`${stat.textColor} text-sm md:text-base font-semibold uppercase tracking-wider mb-3 truncate opacity-80`}
                      >
                        {stat.title}
                      </p>
                      <p className="text-3xl md:text-4xl font-bold text-slate-800 group-hover:scale-105 transition-transform duration-300">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-3 md:p-4 rounded-xl ${stat.iconBg} ml-3 flex-shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}
                    >
                      <IconComponent
                        className={`w-6 h-6 md:w-7 md:h-7 ${stat.iconColor}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Month Filter */}
        <section className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
            <label className="block text-lg font-bold text-slate-700 mb-4">
              Filter by Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="block w-full md:w-64 px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-slate-700 font-medium"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Timeline Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Appointment Timeline
            </h2>
            <p className="text-slate-600 mt-2 text-lg">
              {sortedAppointments.length} appointment
              {sortedAppointments.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-300 to-cyan-500"></div>

            {sortedAppointments.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 w-fit mx-auto mb-6">
                  <CalendarDays className="w-16 h-16 text-slate-400 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">
                  No appointments found
                </h3>
                <p className="text-slate-500 text-lg">
                  No appointments found for the selected month.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {sortedAppointments.map((appointment, index) => (
                  <div
                    key={appointment.id}
                    className="relative flex items-start"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-cyan-500 to-sky-500 rounded-full border-4 border-white shadow-lg z-10"></div>

                    {/* Content */}
                    <div className="ml-16 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-6 w-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          {/* Doctor and Specialty */}
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center text-slate-900">
                              <User className="h-5 w-5 text-cyan-500 mr-2" />
                              <span className="font-bold text-lg group-hover:text-cyan-600 transition-colors duration-300">
                                {appointment.doctorName}
                              </span>
                            </div>
                          </div>

                          <p className="text-slate-600 text-base mb-3 font-medium">
                            {appointment.specialty}
                          </p>

                          {/* Date and Time */}
                          <div className="flex flex-wrap items-center gap-6 mb-4">
                            <div className="flex items-center text-slate-700">
                              <Calendar className="h-4 w-4 text-cyan-500 mr-2" />
                              <span className="font-semibold">
                                {formatDate(appointment.date)}
                              </span>
                            </div>
                            <div className="flex items-center text-slate-600">
                              <Clock className="h-4 w-4 text-cyan-500 mr-2" />
                              <span className="font-medium">
                                {formatTime(appointment.date)}
                              </span>
                            </div>
                          </div>

                          {/* Type, Booking Type, and Status */}
                          <div className="flex flex-wrap items-center gap-4">
                            <span className="inline-block bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm capitalize">
                              {appointment.type}
                            </span>

                            <div className="flex items-center bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-2 rounded-xl">
                              <span className="mr-2 text-lg">
                                {getBookingTypeIcon(appointment.bookingType)}
                              </span>
                              <span className="text-sm text-slate-700 font-semibold capitalize">
                                {appointment.bookingType}
                              </span>
                            </div>

                            <span
                              className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold shadow-sm capitalize ${getStatusBadge(
                                appointment.status
                              )}`}
                            >
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClientTimeline;
