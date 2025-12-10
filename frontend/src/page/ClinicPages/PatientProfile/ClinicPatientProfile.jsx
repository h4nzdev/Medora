import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserCheck,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDate, useTime } from "../../../utils/date";
import { AppointmentContext } from "../../../context/AppointmentContext";
import { getStatusBadge } from "../../../utils/clientAppointment";

const ClinicPatientProfile = () => {
  const { appointments } = useContext(AppointmentContext);
  const { id } = useParams();
  const patientAppointments = appointments?.filter(
    (appointment) => appointment.patientId?._id === id
  );

  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/patient/${id}`
        );
        setPatient(res.data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatient();
  }, [id]);

  if (!patient) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading patient data...</p>
        </div>
      </div>
    );
  }

  // Generate initials for avatar placeholder
  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(patient.name);

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="mx-auto px-4 py-6">
        <header className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate("/clinic/patients")}
              type="button"
              className="bg-white hover:bg-slate-100 border border-slate-200 p-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-3 rounded-2xl shadow-lg">
              <Eye className="w-8 h-8 text-white" />
            </div>

            {/* Enhanced Profile Picture */}
            <div className="relative">
              {patient.patientPicture ? (
                <div className="relative">
                  <img
                    src={patient.patientPicture}
                    alt={patient.name}
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl hidden items-center justify-center font-bold text-white text-2xl shadow-lg border-4 border-white">
                    {initials}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-3 border-white shadow-md"></div>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center font-bold text-white text-2xl shadow-lg border-4 border-white">
                    {initials}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-3 border-white shadow-md"></div>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                {patient.name}
              </h1>
              <p className="text-slate-600 mt-1 text-lg">
                Patient Profile & Medical History
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  Active Patient
                </span>
                <span className="text-slate-400 text-sm">
                  ID: {patient._id.slice(-8).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Personal Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard
                  icon={User}
                  title="Full Name"
                  value={patient.name}
                  color="cyan"
                />
                <InfoCard
                  icon={Calendar}
                  title="Age"
                  value={`${patient.age} years old`}
                  color="cyan"
                />
                <InfoCard
                  icon={UserCheck}
                  title="Gender"
                  value={patient.gender}
                  color="cyan"
                />
                <InfoCard
                  icon={User}
                  title="Role"
                  value={patient.role}
                  color="cyan"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Contact Information
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <InfoCard
                  icon={Mail}
                  title="Email Address"
                  value={patient.email}
                  color="cyan"
                  fullWidth={true}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard
                    icon={Phone}
                    title="Phone Number"
                    value={patient.phone}
                    color="cyan"
                  />
                  <InfoCard
                    icon={MapPin}
                    title="Address"
                    value={patient.address}
                    color="cyan"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Account Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Account Details
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                  <div className="bg-cyan-50 p-3 rounded-xl shadow-sm">
                    <User className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600">
                      Patient ID
                    </p>
                    <p className="text-lg font-bold text-slate-800 font-mono">
                      #{patient._id.slice(-12).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                  <div className="bg-cyan-50 p-3 rounded-xl shadow-sm">
                    <Calendar className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600">
                      Member Since
                    </p>
                    <p className="text-lg font-bold text-slate-800">
                      {useDate(patient.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-8 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-100">Total Appointments</span>
                  <span className="text-2xl font-bold">
                    {patientAppointments?.length || 0}
                  </span>
                </div>
                <div className="h-px bg-cyan-400/30"></div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-100">Account Status</span>
                  <span className="bg-emerald-500 px-3 py-1 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment History */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Appointment History
                </h2>
                <p className="text-slate-600">
                  Complete medical appointment records
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-bold text-slate-700">
                        Doctor
                      </th>
                      <th className="text-left py-4 px-6 font-bold text-slate-700">
                        Date & Time
                      </th>
                      <th className="text-left py-4 px-6 font-bold text-slate-700">
                        Type
                      </th>
                      <th className="text-left py-4 px-6 font-bold text-slate-700">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 font-bold text-slate-700">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patientAppointments?.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-16">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                              <Calendar className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600 font-semibold text-lg mb-2">
                              No appointments found
                            </p>
                            <p className="text-slate-500 text-sm">
                              This patient has no scheduled appointments yet
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      patientAppointments?.map((app, index) => (
                        <tr
                          key={app._id}
                          className={`hover:bg-slate-50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                          }`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center">
                                <User className="w-5 h-5 text-cyan-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">
                                  {app.doctorId?.name || "Unknown Doctor"}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Medical Professional
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-semibold text-slate-800">
                                {useDate(app.date)}
                              </p>
                              <p className="text-sm text-slate-500 font-mono">
                                {useTime(app.date)}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-semibold bg-cyan-100 text-cyan-800 capitalize">
                              {app.type}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            {getStatusBadge(app.status)}
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-sm text-slate-600 font-medium">
                              {useDate(app.createdAt)}
                            </p>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon: Icon, title, value, color, fullWidth = false }) => {
  const colorClasses = {
    cyan: {
      bg: "bg-cyan-50",
      text: "text-cyan-600",
      iconBg: "bg-cyan-100",
      border: "border-cyan-200",
    },
  };

  const classes = colorClasses[color] || colorClasses.cyan;

  return (
    <div
      className={`flex items-center space-x-4 p-5 ${
        classes.bg
      } rounded-xl border ${
        classes.border
      } hover:shadow-sm transition-all duration-200 ${
        fullWidth ? "md:col-span-2" : ""
      }`}
    >
      <div className={`${classes.iconBg} p-3 rounded-xl shadow-sm`}>
        <Icon className={`w-6 h-6 ${classes.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-600 mb-1">{title}</p>
        <p className="text-lg font-bold text-slate-800 break-words">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ClinicPatientProfile;
