import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useState, useMemo, useContext } from "react";
import { AppointmentContext } from "../../../context/AppointmentContext";
import { AuthContext } from "../../../context/AuthContext";

export default function ClientCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  return (
    <div className="w-full lg:p-6">
      <div className="mx-auto">
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
              <CalendarIcon className="w-5 h-5 sm:w-8 sm:h-8 text-white drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-800">
                My Appointments Calendar
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                View your appointments.
              </p>
            </div>
          </div>
        </div>

        <div className="md:bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 lg:p-8">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <button
              onClick={prevMonth}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-slate-100 transition-all duration-200 border border-slate-200 shadow-sm hover:shadow-md"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-slate-600" />
            </button>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-800 px-3 sm:px-6 py-1 sm:py-2 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200">
              {monthYear}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-slate-100 transition-all duration-200 border border-slate-200 shadow-sm hover:shadow-md"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-slate-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3 text-center text-xs sm:text-sm font-semibold text-slate-700 mb-3 sm:mb-6">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => {
              const fullDays = [
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
              ];
              return (
                <div
                  key={index}
                  className="py-2 sm:py-3 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm"
                >
                  <span className="sm:hidden">{day}</span>
                  <span className="hidden sm:inline">{fullDays[index]}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3">
            {Array.from({ length: startingDay }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="border-2 border-dashed border-slate-200 rounded-lg sm:rounded-xl p-1 sm:p-2 lg:p-3 h-20 sm:h-32 lg:h-36 bg-slate-50/30"
              ></div>
            ))}
            {daysInMonth.map((day, index) => {
              const dayAppointments = appointmentsForDate(day);

              return (
                <div
                  key={index}
                  className={`relative border-2 rounded-lg sm:rounded-xl p-1 sm:p-2 lg:p-3 h-20 sm:h-32 lg:h-36 flex flex-col transition-all duration-200 hover:shadow-lg ${
                    new Date().toDateString() === day.toDateString()
                      ? "bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-300 shadow-lg"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {/* Date */}
                  <span
                    className={`font-bold text-sm sm:text-base lg:text-lg mb-1 ${
                      new Date().toDateString() === day.toDateString()
                        ? "text-cyan-700"
                        : "text-slate-800"
                    }`}
                  >
                    {day.getDate()}
                  </span>

                  {/* Appointment count badge */}
                  {dayAppointments.length > 0 && (
                    <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-cyan-500 text-white text-xs font-bold px-1 sm:px-2 py-0.5 sm:py-1 rounded-full min-w-5 h-5 sm:min-w-6 sm:h-6 flex items-center justify-center">
                      {dayAppointments.length}
                    </div>
                  )}

                  {/* Appointments list */}
                  <div className="flex-1 overflow-y-auto space-y-1 sm:space-y-2 pr-1 mt-1 sm:mt-2">
                    {dayAppointments.map((appointment, i) => (
                      <div
                        key={i}
                        className="bg-white border border-slate-200 rounded-md sm:rounded-lg p-1 sm:p-2 lg:p-3 shadow-sm hover:shadow-md transition-all duration-200 text-xs sm:text-sm leading-tight sm:leading-relaxed"
                      >
                        {/* Mobile: Show only essential info */}
                        <div className="sm:hidden">
                          <div className="font-medium text-cyan-600 text-xs truncate">
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

                        {/* Desktop: Show full details */}
                        <div className="hidden sm:block">
                          <div className="font-medium text-slate-800 text-xs mb-1 truncate flex items-center">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2 flex-shrink-0"></div>
                            {appointment.clinicId?.name}
                          </div>
                          <div className="text-cyan-600 text-xs font-semibold mb-1 truncate">
                            Dr. {appointment.doctorId?.name}
                          </div>
                          {appointment.time && (
                            <div className="text-slate-500 text-xs font-medium">
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
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
