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
    <div className="w-full">
      <div className="mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-3 rounded-2xl shadow-xl">
              <CalendarIcon className="w-8 h-8 text-white drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-800">
                My Appointments Calendar
              </h1>
              <p className="text-slate-600 mt-1">
                View your appointments.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={prevMonth}
              className="p-3 rounded-xl hover:bg-slate-100 transition-all duration-200 border border-slate-200 shadow-sm hover:shadow-md"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            <h2 className="text-2xl font-semibold text-slate-800 px-6 py-2 bg-slate-50 rounded-xl border border-slate-200">
              {monthYear}
            </h2>
            <button
              onClick={nextMonth}
              className="p-3 rounded-xl hover:bg-slate-100 transition-all duration-200 border border-slate-200 shadow-sm hover:shadow-md"
            >
              <ChevronRight className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-3 text-center text-sm font-semibold text-slate-700 mb-6">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="py-3 bg-slate-50 rounded-xl border border-slate-200 shadow-sm"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {Array.from({ length: startingDay }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="border-2 border-dashed border-slate-200 rounded-xl p-3 h-36 bg-slate-50/30"
              ></div>
            ))}
            {daysInMonth.map((day, index) => {
              const dayAppointments = appointmentsForDate(day);

              return (
                <div
                  key={index}
                  className={`relative border-2 rounded-xl p-3 h-36 flex flex-col transition-all duration-200 hover:shadow-lg ${
                    new Date().toDateString() === day.toDateString()
                      ? "bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-300 shadow-lg"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {/* Date */}
                  <span
                    className={`font-bold text-lg mb-1 ${
                      new Date().toDateString() === day.toDateString()
                        ? "text-cyan-700"
                        : "text-slate-800"
                    }`}
                  >
                    {day.getDate()}
                  </span>

                  {/* Appointment count badge */}
                  {dayAppointments.length > 0 && (
                    <div className="absolute top-2 right-2 bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {dayAppointments.length}
                    </div>
                  )}

                  {/* Appointments list */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 hide-scroll mt-2">
                    {dayAppointments.map((appointment, i) => (
                      <div
                        key={i}
                        className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 text-sm leading-relaxed"
                      >
                        <div className="font-medium text-slate-800 text-xs mb-2 truncate flex items-center">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2 flex-shrink-0"></div>
                          {appointment.clinicId?.name}
                        </div>
                        <div className="text-cyan-600 text-xs font-semibold mb-1 truncate">
                          Dr. {appointment.doctorId?.name}
                        </div>
                        {appointment.time && (
                          <div className="text-slate-500 text-xs font-medium">
                            {new Date(appointment.time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
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