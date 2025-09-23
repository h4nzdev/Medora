"use client";

import {
  Calendar as CalendarIcon,
  Heart,
  Plus,
  Bot,
  BellRing,
  MoreHorizontal,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { getStatusBadge } from "../../../utils/clientAppointment";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useDate, useTime } from "../../../utils/date";

export default function ClientDashboard() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showAll, setShowAll] = useState(false);

  const healthTips = [
    "Stay hydrated by drinking at least 8 glasses of water a day.",
    "Incorporate at least 30 minutes of moderate-intensity exercise into your daily routine.",
    "Ensure you get 7-9 hours of quality sleep per night for better health.",
    "A balanced diet rich in fruits, vegetables, and whole grains is key to a healthy lifestyle.",
  ];

  const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/appointment/patient/${user._id}`
      );
      setAppointments(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchAppointments();
      const interval = setInterval(() => {
        fetchAppointments();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const upcomingAppointments = appointments.filter(
    (app) => new Date(app.date) > new Date() && app.status === "scheduled"
  );

  const completedAppointments = appointments.filter(
    (app) => app.status === "completed"
  );

  const visibleAppointments = showAll
    ? completedAppointments
    : completedAppointments.slice(0, 5);

  return (
    <div className="w-full flex">
      <div className="mx-auto flex-1">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-800">
                Welcome, {user.name}!
              </h1>
              <p className="text-slate-600 mt-1">
                Here's a summary of your health journey today.
              </p>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Upcoming Appointments
                </p>
                <p className="text-4xl font-semibold text-cyan-600">
                  {upcomingAppointments.length}
                </p>
                <p className="text-sm text-emerald-600 mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Next: Tomorrow 9:00 AM
                </p>
              </div>
              <div className="bg-cyan-500 p-4 rounded-2xl shadow-md">
                <CalendarIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between h-full">
              <div className="flex-1 pr-3">
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-2">
                  Health Tip of the Day
                </p>
                <p className="text-slate-700 leading-relaxed font-medium text-sm md:text-base">
                  {randomTip}
                </p>
              </div>
              <div className="bg-emerald-500 p-4 rounded-2xl shadow-md flex-shrink-0">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="group w-full flex items-center space-x-4 p-6 bg-cyan-50 hover:bg-cyan-100 rounded-xl transition-all duration-300 border border-cyan-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="bg-cyan-500 p-3 rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <Link to="/client/appointments">
                <div className="text-left">
                  <h3 className="font-semibold text-slate-800 text-lg">
                    Book Appointment
                  </h3>
                  <p className="text-slate-600">Schedule your next visit</p>
                </div>
              </Link>
            </button>

            <button className="group w-full flex items-center space-x-4 p-6 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all duration-300 border border-sky-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="bg-sky-500 p-3 rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <Link to="/client/chats">
                <div className="text-left">
                  <h3 className="font-semibold text-slate-800 text-lg">
                    Start AI Chat
                  </h3>
                  <p className="text-slate-600">Get instant health advice</p>
                </div>
              </Link>
            </button>

            <button className="group w-full flex items-center space-x-4 p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 border border-blue-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="bg-blue-500 p-3 rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <BellRing className="w-6 h-6 text-white" />
              </div>
              <Link to="/client/reminders">
                <div className="text-left">
                  <h3 className="font-semibold text-slate-800 text-lg">
                    Set Reminder
                  </h3>
                  <p className="text-slate-600">Never miss medication</p>
                </div>
              </Link>
            </button>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            Recent Appointments
          </h2>

          {/* Mobile Card Layout */}
          <div className="block lg:hidden space-y-4">
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-slate-800 text-lg">
                      Dr. Sarah Wilson
                    </h3>
                    <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                      Cardiology
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-1">
                    2024-09-10 at 09:00 AM
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge("confirmed")}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium">
                    Consultation
                  </span>
                </div>
                <button
                  type="button"
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="hidden lg:block bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 font-semibold text-slate-700 text-sm">
                      Doctor
                    </th>
                    <th className="py-4 px-4 font-semibold text-slate-700 text-sm">
                      Specialty
                    </th>
                    <th className="py-4 px-4 font-semibold text-slate-700 text-sm">
                      Date & Time
                    </th>
                    <th className="py-4 px-4 font-semibold text-slate-700 text-sm">
                      Type
                    </th>
                    <th className="py-4 px-4 font-semibold text-slate-700 text-sm">
                      Status
                    </th>
                    <th className="py-4 px-4 font-semibold text-slate-700 text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {completedAppointments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-16">
                        <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 w-fit mx-auto mb-6">
                          <CalendarIcon className="w-20 h-20 text-slate-400 mx-auto" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-700 mb-3">
                          No completed appointments yet
                        </h3>
                        <p className="text-slate-500 text-lg">
                          Your completed appointments will appear here.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    visibleAppointments.map((appointment) => (
                      <tr
                        key={appointment._id}
                        className="group relative overflow-hidden bg-slate-50 border border-slate-200 rounded-xl hover:shadow-md hover:border-cyan-300 transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <td className="py-6 px-4">
                          <p className="font-semibold text-slate-800 text-lg">
                            {appointment?.doctorId?.name}
                          </p>
                          <p className="text-sm text-slate-500">ID: #0001</p>
                        </td>
                        <td className="px-4">
                          <p className="font-medium text-slate-700">
                            {appointment?.doctorId?.specialty}
                          </p>
                        </td>
                        <td className="px-4">
                          <p className="font-medium text-slate-700">
                            {useDate(appointment.date)}
                          </p>
                          {useTime(appointment.date)}
                        </td>
                        <td className="px-4">
                          <span className="inline-block bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium capitalize">
                            {appointment.type}
                          </span>
                        </td>
                        <td className="px-4">
                          {getStatusBadge(appointment.status)}
                        </td>
                        <td className="px-4 text-right">
                          <button
                            type="button"
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                            aria-label="More options"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {showAll ? "Show Less" : "View All Appointments"}
              </button>
            </div>
          </div>
        </section>
      </div>
      <div className="hidden lg:block w-100 mt-19 p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-cyan-600" />
            </div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Calendar
            </h2>
          </div>
          <div className="calendar-container">
            <Calendar
              onChange={setDate}
              value={date}
              tileDisabled={() => true}
              tileClassName={({ date }) => {
                const hasAppointment = appointments.some(
                  (app) =>
                    new Date(app.date).toDateString() === date.toDateString() &&
                    app.status === "scheduled"
                );
                return hasAppointment
                  ? "!bg-gradient-to-r from-cyan-400 to-cyan-500 !text-white rounded-full shadow-md transform hover:scale-105 transition-all"
                  : "hover:bg-gray-100 transition-colors";
              }}
              tileContent={({ date }) => {
                const hasAppointment = appointments.some(
                  (app) =>
                    new Date(app.date).toDateString() === date.toDateString() &&
                    app.status === "scheduled"
                );
                return hasAppointment ? (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="h-1.5 w-1.5 bg-white rounded-full shadow-sm"></div>
                  </div>
                ) : null;
              }}
              className="!border-none !bg-transparent"
            />
          </div>
        </div>
        <div className="mt-6 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Upcoming Appointments
          </h3>
          {upcomingAppointments.length > 0 ? (
            <ul className="space-y-3">
              {upcomingAppointments.map((app) => (
                <li
                  key={app._id}
                  className="flex items-center justify-between space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-cyan-500 p-2 rounded-lg">
                      <CalendarIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        {app.doctorId.name}
                      </p>
                      <p className="text-sm text-slate-600">
                        {useDate(app.date)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">
                      {useTime(app.date)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm">No upcoming appointments</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .calendar-container .react-calendar {
          font-family: inherit;
        }
        .calendar-container .react-calendar__tile {
          position: relative;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .calendar-container .react-calendar__tile--active {
          background: linear-gradient(135deg, #06b6d4, #0891b2) !important;
          color: white !important;
          border-radius: 50% !important;
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3) !important;
        }
        .calendar-container .react-calendar__tile:hover {
          background: #f1f5f9 !important;
          border-radius: 50% !important;
        }
        .calendar-container .react-calendar__tile--now {
          background: #f8fafc !important;
          color: #0f172a !important;
          font-weight: 600;
        }
        .calendar-container .react-calendar__navigation {
          margin-bottom: 1rem;
        }
        .calendar-container .react-calendar__navigation button {
          background: none;
          border: none;
          font-size: 1.1rem;
          font-weight: 600;
          color: #374151;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .calendar-container .react-calendar__navigation button:hover {
          background: #f1f5f9;
        }
        .calendar-container .react-calendar__month-view__weekdays {
          margin-bottom: 0.5rem;
        }
        .calendar-container .react-calendar__month-view__weekdays__weekday {
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
          text-align: center;
          padding: 0.5rem 0;
        }
        .calendar-container .react-calendar__month-view__days__day {
          font-size: 0.875rem;
          font-weight: 500;
          height: 2.5rem;
          width: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0.125rem;
        }
        .calendar-container .react-calendar__month-view__days__day--weekend {
          color: #dc2626;
        }
        .calendar-container
          .react-calendar__month-view__days__day--neighboringMonth {
          color: #d1d5db;
        }
      `}</style>
    </div>
  );
}
