import {
  CalendarPlus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  AlertTriangle,
} from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { AppointmentContext } from "../../../context/AppointmentContext";
import { AuthContext } from "../../../context/AuthContext";
import { ClinicContext } from "../../../context/ClinicContext";
import {
  getStatusIcon,
  getStatusBadge1,
} from "../../../utils/appointmentStats.jsx";
import { getStatusBadge } from "../../../utils/clientAppointment.jsx";
import { formatDate, useDate, useTime } from "../../../utils/date.jsx";
import { useNavigate } from "react-router-dom";
import ClientAppointmentActions from "./components/ClientAppointmentActions.jsx";

export default function ClientAppointments() {
  const { appointments } = useContext(AppointmentContext);
  const { user } = useContext(AuthContext);
  const { clinics } = useContext(ClinicContext);
  const navigate = useNavigate();

  // Plan limits
  const planLimits = {
    free: 10,
    basic: 20,
    pro: Infinity, // unlimited
  };

  // Filter patient appointments
  const patientAppointments = appointments.filter(
    (app) => app.patientId._id === user._id
  );

  // Get the latest clinic info from ClinicContext
  const clinic = clinics?.find((c) => c._id === user.clinicId._id);
  const plan = clinic?.subscriptionPlan || "free";
  const maxAppointments = planLimits[plan];

  // Count total appointments for this clinic
  const clinicAppointmentCount = appointments.filter(
    (app) => app.clinicId?._id === user.clinicId._id
  ).length;

  // Check if limit is reached
  const LimitReached = clinicAppointmentCount >= maxAppointments;

  const handleNewAppointmentClick = () => {
    if (LimitReached) {
      toast.error(
        `The clinic has reached its appointment limit for the ${plan} plan.`
      );
    } else {
      navigate("/client/doctors");
    }
  };

  // Stats (unchanged)
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
      title: "Upcoming",
      value: patientAppointments.filter((app) =>
        ["pending", "accepted", "scheduled"].includes(app.status)
      ).length,
      icon: Clock,
      color: "bg-gradient-to-br from-cyan-50 to-sky-50",
      iconBg: "bg-gradient-to-br from-cyan-100 to-sky-100",
      iconColor: "text-cyan-600",
      textColor: "text-cyan-700",
    },
    {
      title: "Completed",
      value: patientAppointments.filter((app) => app.status === "completed")
        .length,
      icon: CheckCircle,
      color: "bg-gradient-to-br from-emerald-50 to-green-50",
      iconBg: "bg-gradient-to-br from-emerald-100 to-green-100",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-700",
    },
    {
      title: "Cancelled",
      value: patientAppointments.filter((app) =>
        ["cancelled", "rejected"].includes(app.status)
      ).length,
      icon: AlertCircle,
      color: "bg-gradient-to-br from-amber-50 to-orange-50",
      iconBg: "bg-gradient-to-br from-amber-100 to-orange-100",
      iconColor: "text-amber-600",
      textColor: "text-amber-700",
    },
  ];

  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30 pb-6">
        <div className="mx-auto">
          <header className="mb-8 md:mb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
                  My Appointments
                </h1>
                <p className="text-slate-600 mt-3 text-lg sm:text-xl leading-relaxed">
                  View and manage your upcoming appointments.
                </p>
                {LimitReached && (
                  <p
                    className="md:text-lg text-red-600 font-semibold mb-2 flex items-center mt-4 border border-red-500 bg-red-200 rounded p-2 max-w-xl justify-center
                  text-sm"
                  >
                    <AlertTriangle className="mr-2" /> The clinic has reached
                    its appointment limit for the {clinic?.subscriptionPlan}{" "}
                    plan.
                  </p>
                )}
              </div>
              <button
                onClick={handleNewAppointmentClick}
                className={`group flex items-center justify-center px-6 md:px-8 py-4 text-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto text-base md:text-lg font-semibold ${
                  LimitReached
                    ? "bg-slate-600/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-sky-500"
                }`}
              >
                <CalendarPlus className="w-5 h-5 md:w-6 md:h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                New Appointment
              </button>
            </div>
          </header>

          <section className="mb-8 md:mb-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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

          <section>
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                All Appointments
              </h2>
              <p className="text-slate-600 mt-2 text-lg">
                {patientAppointments.length} appointment
                {patientAppointments.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="block lg:hidden space-y-4">
              {patientAppointments.length > 0 ? (
                patientAppointments.map((appointment, index) => (
                  <div
                    key={appointment._id || index}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-cyan-600 transition-colors duration-300">
                          {appointment?.doctorId?.name}
                        </h3>
                        <p className="text-slate-600 text-base mb-3 font-medium">
                          {appointment.doctorId?.specialty}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-base mb-4">
                      <div className="bg-slate-50/80 rounded-xl p-3">
                        <p className="text-slate-500 text-sm uppercase tracking-wide mb-1 font-semibold">
                          Date
                        </p>
                        <p className="font-bold text-slate-700">
                          {formatDate(appointment.date)}
                        </p>
                      </div>
                      <div className="bg-slate-50/80 rounded-xl p-3">
                        <p className="text-slate-500 text-sm uppercase tracking-wide mb-1 font-semibold">
                          Time
                        </p>
                        <p className="font-bold text-slate-700">
                          {appointment.time || "09:00 AM"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-base text-slate-700 font-medium">
                            {user.phone || "Phone not available"}
                          </p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                        <ClientAppointmentActions />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
                  <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 w-fit mx-auto mb-6">
                    <Calendar className="w-16 h-16 text-slate-400 mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">
                    No appointments found
                  </h3>
                  <p className="text-slate-500 text-lg">
                    Click "New Appointment" to schedule one.
                  </p>
                </div>
              )}
            </div>

            <div className="hidden lg:block overflow-visible rounded-2xl border border-white/20 bg-white/80 backdrop-blur-sm shadow-lg">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                  <tr>
                    <th className="py-6 px-6 font-bold text-slate-700 text-base">
                      Doctor
                    </th>
                    <th className="py-6 px-6 font-bold text-slate-700 text-base">
                      Specialty
                    </th>
                    <th className="py-6 px-6 font-bold text-slate-700 text-base">
                      Date & Time
                    </th>
                    <th className="py-6 px-6 font-bold text-slate-700 text-base">
                      Type
                    </th>
                    <th className="py-6 px-6 font-bold text-slate-700 text-base">
                      Status
                    </th>
                    <th className="py-6 px-6 font-bold text-slate-700 text-base">
                      Contact
                    </th>
                    <th className="py-6 px-6 font-bold text-slate-700 text-base">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patientAppointments.length > 0 ? (
                    patientAppointments.map((appointment, index) => (
                      <tr
                        key={appointment._id || index}
                        className="hover:bg-slate-50/50 transition-all duration-300 border-t border-slate-200/30 group"
                      >
                        <td className="py-6 px-6">
                          <p className="font-bold text-slate-800 text-lg group-hover:text-cyan-600 transition-colors duration-300">
                            {appointment?.doctorId?.name}
                          </p>
                          <p className="text-base text-slate-500 font-medium">
                            ID: #{appointment._id?.slice(-4)}
                          </p>
                        </td>
                        <td className="px-6">
                          <p className="font-semibold text-slate-700 text-base">
                            {appointment.doctorId?.specialty}
                          </p>
                        </td>
                        <td className="px-6">
                          <p className="font-semibold text-slate-700 text-base">
                            {formatDate(appointment.date)}
                          </p>
                          <p className="text-base text-slate-500 font-medium">
                            {useTime(appointment.date)}
                          </p>
                        </td>
                        <td className="px-6">
                          <span className="inline-block bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 px-4 py-2 rounded-xl text-base font-semibold shadow-sm capitalize">
                            {appointment.type}
                          </span>
                        </td>
                        <td className="px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm w-fit ${getStatusBadge1(
                              appointment.status
                            )}`}
                          >
                            {getStatusIcon(appointment.status)}
                            {appointment.status}
                          </span>
                        </td>
                        <td className="px-6 text-base">
                          <p className="text-slate-700 font-medium">
                            {user.phone || "Phone not available"}
                          </p>
                          <p className="text-slate-500">{user.email}</p>
                        </td>
                        <td className="px-6 text-right">
                          <ClientAppointmentActions
                            id={appointment._id}
                            appointment={appointment}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-16">
                        <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 w-fit mx-auto mb-6">
                          <Calendar className="w-20 h-20 text-slate-400 mx-auto" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-700 mb-3">
                          No appointments found
                        </h3>
                        <p className="text-slate-500 text-lg">
                          Click "New Appointment" to schedule one.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
