import {
  CalendarPlus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  AlertTriangle,
  XCircle,
  Bell,
  ChevronRight,
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
import { motion, AnimatePresence } from "framer-motion";
import ClientDesktopActions from "./components/ClientDesktopActions.jsx";

// New Actions Component with React Native Style Modal
const ClientAppointmentActions = ({ id, appointment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleDelete = async (id, setIsLoading, setIsOpen) => {
    setIsLoading(true);
    // Your delete logic here
    console.log("Deleting appointment:", id);
    setIsLoading(false);
    setIsOpen(false);
  };

  const handleSetReminder = (appointment) => {
    setDropdownVisible(false);
    console.log("Setting reminder for:", appointment);
    toast.success("Reminder set for appointment!");
  };

  const handleCancelAppointment = async (appointment) => {
    setDropdownVisible(false);
    try {
      console.log(`🔄 Cancelling appointment: ${appointment._id}`);
      // Add your cancel appointment API call here
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      console.error("❌ Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  // Modal animations
  const modalBackdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const modalContentVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      y: "100%",
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setDropdownVisible(true)}
        className="lg:hidden p-1 hover:bg-slate-100 rounded transition-colors"
      >
        <MoreHorizontal className="w-5 h-5 text-slate-600" />
      </button>

      {/* React Native Style Modal for Mobile */}
      <AnimatePresence>
        {dropdownVisible && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center lg:hidden"
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setDropdownVisible(false)}
          >
            <motion.div
              className="bg-white rounded-t-2xl mx-2 mb-2 shadow-2xl w-full max-w-md"
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-1 bg-slate-300 rounded-full" />
              </div>

              {/* Menu header */}
              <div className="px-6 pb-3 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">
                  Appointment Options
                </h3>
                <p className="text-slate-500 text-sm mt-1 truncate">
                  {appointment?.doctorId?.name}
                </p>
              </div>

              {/* Menu items */}
              <div className="py-2">
                {/* Set Reminder */}
                <button
                  onClick={() => handleSetReminder(appointment)}
                  className="flex items-center w-full px-6 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <div className="bg-blue-100 p-3 rounded-xl mr-4">
                    <Bell className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-slate-800 font-medium text-base">
                      Set Reminder
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Get notified before appointment
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Cancel Appointment */}
                <button
                  onClick={() => handleCancelAppointment(appointment)}
                  className="flex items-center w-full px-6 py-4 hover:bg-red-50 active:bg-red-100 transition-colors"
                >
                  <div className="bg-red-100 p-3 rounded-xl mr-4">
                    <XCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-red-600 font-medium text-base">
                      Cancel Appointment
                    </p>
                    <p className="text-red-400 text-sm mt-1">
                      Free up this time slot
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-400" />
                </button>

                {/* Edit Appointment */}
                <button className="flex items-center w-full px-6 py-4 hover:bg-cyan-50 active:bg-cyan-100 transition-colors">
                  <div className="bg-cyan-100 p-3 rounded-xl mr-4">
                    <Calendar className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-slate-800 font-medium text-base">
                      Edit Appointment
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Change date or time
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Cancel button */}
              <button
                onClick={() => setDropdownVisible(false)}
                className="mx-4 my-3 bg-slate-100 py-4 rounded-xl w-[calc(100%-2rem)] hover:bg-slate-200 active:bg-slate-300 transition-colors"
              >
                <p className="text-slate-600 font-semibold text-base">Close</p>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Format date for display (React Native style)
const formatDisplayDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    return "Invalid Date";
  }
};

// Format time for display (React Native style)
const formatDisplayTime = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    return "Invalid Time";
  }
};

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

            {/* Mobile Card Layout - REACT NATIVE STYLE */}
            <div className="block lg:hidden space-y-4">
              {patientAppointments.length > 0 ? (
                patientAppointments.map((appointment, index) => (
                  <div
                    key={appointment._id || index}
                    className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
                  >
                    {/* Doctor Info Row */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 mr-2">
                        <h3 className="font-bold text-slate-800 text-lg mb-2 truncate">
                          {appointment?.doctorId?.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-slate-200 px-3 py-1 rounded-full text-slate-600 text-xs font-medium">
                            {appointment?.doctorId?.specialty}
                          </span>
                          <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700 text-xs font-medium capitalize">
                            {appointment.type}
                          </span>
                        </div>
                      </div>

                      {/* Status & Menu */}
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(appointment.status)}
                        <ClientAppointmentActions
                          id={appointment._id}
                          appointment={appointment}
                        />
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center flex-1">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <p className="text-slate-600 ml-2 font-medium">
                          {formatDisplayDate(appointment.date)}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <p className="text-slate-600 ml-2 font-medium">
                          {formatDisplayTime(appointment.date)}
                        </p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="pt-4 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-700 font-medium">
                            {user.phone || "Phone not available"}
                          </p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                          ID: #{appointment._id?.slice(-4)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
                  <div className="bg-slate-100 rounded-2xl p-6 mb-6 inline-block">
                    <Calendar className="w-16 h-16 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">
                    No appointments found
                  </h3>
                  <p className="text-slate-500 mb-6">
                    Click "New Appointment" to schedule one.
                  </p>
                  <button
                    onClick={handleNewAppointmentClick}
                    className={`inline-flex items-center px-6 py-3 rounded-xl text-white font-semibold ${
                      LimitReached
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-cyan-500 hover:bg-cyan-600"
                    } transition-colors`}
                  >
                    <CalendarPlus className="w-5 h-5 mr-2" />
                    New Appointment
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Table View - UNCHANGED */}
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
                          <ClientDesktopActions
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
