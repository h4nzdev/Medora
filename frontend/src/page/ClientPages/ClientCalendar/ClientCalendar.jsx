import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Grid3X3,
  List,
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
    <div className="min-h-screen bg-slate-50 pb-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6 pt-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">
                My Calendar
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                View and manage your appointments
              </p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200 mb-4">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                viewMode === "calendar"
                  ? "bg-cyan-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              Calendar
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                viewMode === "list"
                  ? "bg-cyan-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h2 className="text-lg font-semibold text-slate-800 px-4 py-2 bg-slate-50 rounded-lg">
            {monthYear}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-600 mb-3">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <div key={index} className="py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDay }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="aspect-square rounded-lg bg-slate-50"
                ></div>
              ))}

              {/* Days of the month */}
              {daysInMonth.map((day, index) => {
                const dayAppointments = appointmentsForDate(day);
                const isToday =
                  new Date().toDateString() === day.toDateString();
                const hasAppointments = dayAppointments.length > 0;

                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-start p-1 transition-all duration-200 ${
                      isToday
                        ? "bg-cyan-500 text-white shadow-md"
                        : hasAppointments
                        ? "bg-cyan-50 border border-cyan-200"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    {/* Date Number */}
                    <span
                      className={`text-sm font-medium ${
                        isToday ? "text-white" : "text-slate-700"
                      }`}
                    >
                      {day.getDate()}
                    </span>

                    {/* Appointment Dots */}
                    {hasAppointments && (
                      <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                        {dayAppointments.slice(0, 3).map((appointment, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              isToday ? "bg-white" : "bg-cyan-500"
                            }`}
                          ></div>
                        ))}
                        {dayAppointments.length > 3 && (
                          <div
                            className={`text-[10px] ${
                              isToday ? "text-white" : "text-cyan-600"
                            }`}
                          >
                            +{dayAppointments.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="space-y-3">
            {monthAppointments.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-200">
                <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 text-sm">
                  No appointments this month
                </p>
              </div>
            ) : (
              monthAppointments.map((appointment, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-base font-semibold text-slate-800 mb-1">
                        {new Date(appointment.date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                      <div className="text-cyan-600 font-medium text-sm">
                        Dr. {appointment.doctorId?.name}
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
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

                  <div className="space-y-1 text-xs text-slate-600">
                    {appointment.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
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
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">
                          {appointment.clinicId.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mt-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            This Month
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-600">
                {monthAppointments.length}
              </div>
              <div className="text-xs text-slate-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {
                  monthAppointments.filter((a) => a.status === "scheduled")
                    .length
                }
              </div>
              <div className="text-xs text-slate-600">Upcoming</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {
                  monthAppointments.filter((a) => a.status === "completed")
                    .length
                }
              </div>
              <div className="text-xs text-slate-600">Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
