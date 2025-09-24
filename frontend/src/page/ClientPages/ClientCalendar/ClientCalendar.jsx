import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
} from "lucide-react";
import { useState, useMemo, useContext } from "react";
import { AppointmentContext } from "../../../context/AppointmentContext";
import { AuthContext } from "../../../context/AuthContext";

export default function ClientCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("calendar"); // calendar or list

  const { appointments } = useContext(AppointmentContext);
  const { user } = useContext(AuthContext);

  const clientAppointments = useMemo(() => {
    if (!appointments || !user) return [];
    return appointments.filter(
      (appointment) => appointment.patientId?._id === user._id
    );
  }, [appointments, user]);

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentDate]);

  const startingDay = useMemo(() => {
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
  }, [currentDate]);

  const monthYear = useMemo(() => {
    return `${currentDate.toLocaleString("default", {
      month: "long",
    })} ${currentDate.getFullYear()}`;
  }, [currentDate]);

  const appointmentsForDate = (date) => {
    return clientAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get appointments for current month
  const monthAppointments = useMemo(() => {
    return clientAppointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return (
          appointmentDate.getMonth() === currentDate.getMonth() &&
          appointmentDate.getFullYear() === currentDate.getFullYear()
        );
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [clientAppointments, currentDate]);

  return (
    <div className="w-full">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-3 rounded-2xl shadow-lg">
              <CalendarIcon className="w-8 h-8 text-white drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-slate-800">
                My Calendar
              </h1>
              <p className="text-base text-slate-600 mt-1">
                View and manage your appointments
              </p>
            </div>
          </div>

          {/* Mobile View Toggle */}
          <div className="flex md:hidden bg-slate-100 rounded-xl p-1 mb-4">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "calendar"
                  ? "bg-white text-cyan-600 shadow-sm"
                  : "text-slate-600"
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "list"
                  ? "bg-white text-cyan-600 shadow-sm"
                  : "text-slate-600"
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-6 bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
          <button
            onClick={prevMonth}
            className="p-3 rounded-xl hover:bg-slate-100 transition-all duration-200 border border-slate-200 shadow-sm hover:shadow-md"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 px-6 py-2 bg-slate-50 rounded-xl border border-slate-200">
            {monthYear}
          </h2>
          <button
            onClick={nextMonth}
            className="p-3 rounded-xl hover:bg-slate-100 transition-all duration-200 border border-slate-200 shadow-sm hover:shadow-md"
          >
            <ChevronRight className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Mobile List View */}
        {viewMode === "list" && (
          <div className="md:hidden space-y-4 pb-6">
            {monthAppointments.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-slate-200">
                <CalendarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-lg text-slate-600">
                  No appointments this month
                </p>
              </div>
            ) : (
              monthAppointments.map((appointment, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg border border-slate-200 p-5 hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-slate-800 mb-1">
                        {new Date(appointment.date).toLocaleDateString(
                          "default",
                          {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </div>
                      <div className="text-cyan-600 font-medium text-base">
                        Dr. {appointment.doctorId?.name}
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.status === "scheduled"
                          ? "bg-cyan-100 text-cyan-700"
                          : appointment.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {appointment.status}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    {appointment.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(appointment.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                    {appointment.clinicId?.name && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.clinicId.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <div className="rounded-2xl sm:p-6 lg:p-8 pb-6">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3 text-center text-sm sm:text-base font-semibold text-slate-700 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => (
                  <div
                    key={index}
                    className="py-3 bg-slate-50 rounded-xl border border-slate-200 shadow-sm"
                  >
                    <span className="sm:hidden">{day[0]}</span>
                    <span className="hidden sm:inline">{day}</span>
                  </div>
                )
              )}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDay }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-2 h-24 sm:h-32 lg:h-40 bg-slate-50/30"
                ></div>
              ))}

              {/* Days of the month */}
              {daysInMonth.map((day, index) => {
                const dayAppointments = appointmentsForDate(day);
                const isToday =
                  new Date().toDateString() === day.toDateString();

                return (
                  <div
                    key={index}
                    className={`relative border-2 rounded-xl p-2 h-24 sm:h-32 lg:h-40 flex flex-col transition-all duration-200 hover:shadow-lg ${
                      isToday
                        ? "bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-300 shadow-lg"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {/* Date Number */}
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`font-bold text-base sm:text-lg ${
                          isToday ? "text-cyan-700" : "text-slate-800"
                        }`}
                      >
                        {day.getDate()}
                      </span>

                      {/* Appointment Count Badge */}
                    </div>

                    {/* Appointments - Different display for mobile vs desktop */}
                    <div className="flex-1 overflow-hidden">
                      {/* Mobile: Just show dots */}
                      {dayAppointments.length > 0 && (
                        <div className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-6 h-6 flex items-center justify-center">
                          {dayAppointments.length}
                        </div>
                      )}

                      {/* Desktop: Show appointment details */}
                      <div className="hidden sm:block space-y-1 lg:space-y-2">
                        {dayAppointments.slice(0, 2).map((appointment, i) => (
                          <div
                            key={i}
                            className="bg-white border border-slate-200 rounded-lg p-1 lg:p-2 shadow-sm hover:shadow-md transition-all duration-200 text-xs leading-tight"
                          >
                            <div className="font-medium text-cyan-600 truncate">
                              Dr. {appointment.doctorId?.name}
                            </div>
                            {appointment.time && (
                              <div className="text-slate-500 text-xs">
                                {new Date(appointment.time).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-slate-500 text-center">
                            +{dayAppointments.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Desktop List View (Always visible on larger screens) */}
        <div className="hidden md:block mt-8">
          <h3 className="text-2xl font-semibold text-slate-800 mb-6">
            Appointments This Month ({monthAppointments.length})
          </h3>

          {monthAppointments.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-slate-200">
              <CalendarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg text-slate-600">
                No appointments this month
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {monthAppointments.map((appointment, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-slate-800 mb-1">
                        {new Date(appointment.date).toLocaleDateString(
                          "default",
                          {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </div>
                      <div className="text-cyan-600 font-medium">
                        Dr. {appointment.doctorId?.name}
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.status === "scheduled"
                          ? "bg-cyan-100 text-cyan-700"
                          : appointment.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {appointment.status}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    {appointment.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(appointment.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                    {appointment.clinicId?.name && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.clinicId.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
