import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useState, useMemo, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppointmentContext } from "../../../context/AppointmentContext";
import { AuthContext } from "../../../context/AuthContext";
import ClinicCalendarSideBar from "./components/ClinicCalendarSideBar";

export default function ClinicCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { appointments } = useContext(AppointmentContext);
  const { user } = useContext(AuthContext);

  const clinicAppointments = useMemo(() => {
    if (!appointments || !user) return [];
    return appointments.filter(
      (appointment) =>
        appointment.clinicId?._id === user._id &&
        appointment.status === "scheduled"
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
    return clinicAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleDateClick = (date) => {
    const dateAppointments = appointmentsForDate(date);
    if (dateAppointments.length > 0) {
      setSelectedDate(date);
      setIsSidebarOpen(true);
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedDate(null);
  };

  const selectedDateAppointments = useMemo(() => {
    if (!selectedDate) return [];
    return appointmentsForDate(selectedDate);
  }, [selectedDate, clinicAppointments]);

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
                Appointments Calendar
              </h1>
              <p className="text-slate-600 mt-1">
                View and manage clinic appointments.
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
              const isSelected =
                selectedDate &&
                selectedDate.toDateString() === day.toDateString();

              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(day)}
                  className={`relative border-2 rounded-xl p-3 h-36 flex flex-col transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 shadow-lg"
                      : new Date().toDateString() === day.toDateString()
                      ? "bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-300 shadow-lg"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg"
                  }`}
                >
                  {/* Date */}
                  <span
                    className={`font-bold text-lg mb-1 ${
                      isSelected
                        ? "text-blue-700"
                        : new Date().toDateString() === day.toDateString()
                        ? "text-cyan-700"
                        : "text-slate-800"
                    }`}
                  >
                    {day.getDate()}
                  </span>

                  {/* Appointment count badge */}
                  {dayAppointments.length > 0 && (
                    <div
                      className={`absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 rounded-full ${
                        isSelected ? "bg-blue-500" : "bg-cyan-500"
                      }`}
                    >
                      {dayAppointments.length}
                    </div>
                  )}

                  {/* Appointments list */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 hide-scroll mt-2">
                    {dayAppointments.slice(0, 2).map((appointment, i) => (
                      <div
                        key={i}
                        className="bg-white border border-slate-200 rounded-lg p-2 shadow-sm text-sm leading-relaxed"
                      >
                        <div className="font-medium text-slate-800 text-xs mb-1 truncate flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 flex-shrink-0 ${
                              isSelected ? "bg-blue-500" : "bg-cyan-500"
                            }`}
                          ></div>
                          {appointment.patientId?.name}
                        </div>
                        <div className="text-cyan-600 text-xs font-semibold truncate">
                          Dr. {appointment.doctorId?.name}
                        </div>
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-slate-500 text-center bg-slate-50 rounded-lg py-1">
                        +{dayAppointments.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar for selected date appointments */}
      <AnimatePresence>
        {isSidebarOpen && selectedDate && (
          <ClinicCalendarSideBar
            closeSidebar={() => setIsSidebarOpen(false)}
            selectedDateAppointments={selectedDateAppointments}
            selectedDate={selectedDate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
