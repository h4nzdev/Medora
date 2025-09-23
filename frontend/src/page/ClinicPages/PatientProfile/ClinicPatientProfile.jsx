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
        <p className="text-slate-600">Loading patient data...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="mx-auto6">
        <header className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate("/clinic/patients")}
              type="button"
              className="bg-white hover:bg-slate-100 border border-slate-200 p-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-800">
                View Patient Profile
              </h1>
              <p className="text-slate-600 mt-1">
                Patient information and details
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                Personal Information
              </h2>
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
                  value={`${patient.age} years`}
                  color="blue"
                />
                <InfoCard
                  icon={UserCheck}
                  title="Gender"
                  value={patient.gender}
                  color="emerald"
                />
                <InfoCard
                  icon={User}
                  title="Role"
                  value={patient.role}
                  color="purple"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                Account Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-slate-100 p-3 rounded-xl">
                    <User className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Patient ID
                    </p>
                    <p className="text-lg font-semibold text-slate-800">
                      #{patient._id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-slate-100 p-3 rounded-xl">
                    <Calendar className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Joined Date
                    </p>
                    <p className="text-lg font-semibold text-slate-800">
                      {useDate(patient.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-8 w-full shadow">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            Contact Information
          </h2>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            <InfoCard
              icon={Mail}
              title="Email Address"
              value={patient.email}
              color="red"
            />
            <InfoCard
              icon={Phone}
              title="Phone Number"
              value={patient.phone}
              color="indigo"
            />
            <InfoCard
              icon={MapPin}
              title="Address"
              value={patient.address}
              color="orange"
            />
          </div>
        </div>

        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
              Appointment History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">
                      Doctor Name
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">
                      Date & Time
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">
                      Type
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patientAppointments?.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12">
                        <div className="bg-slate-100 p-4 rounded-xl w-fit mx-auto mb-4">
                          <Calendar className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500 text-lg">
                          No appointments found
                        </p>
                        <p className="text-slate-400 text-sm">
                          This patient has no scheduled appointments
                        </p>
                      </td>
                    </tr>
                  ) : (
                    patientAppointments?.map((app) => (
                      <tr
                        key={app._id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-slate-800">
                              {app.doctorId?.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-slate-800">
                              {useDate(app.date)}
                            </p>
                            <p className="text-sm text-slate-500">
                              {useTime(app.date)}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 capitalize">
                            {app.type}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(app.status)}
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm text-slate-600">
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
  );
};

const InfoCard = ({ icon: Icon, title, value, color, fullWidth = false }) => {
  const colorClasses = {
    cyan: { bg: "bg-cyan-50", text: "text-cyan-600", iconBg: "bg-cyan-100" },
    blue: { bg: "bg-blue-50", text: "text-blue-600", iconBg: "bg-blue-100" },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    red: { bg: "bg-red-50", text: "text-red-600", iconBg: "bg-red-100" },
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      iconBg: "bg-indigo-100",
    },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      iconBg: "bg-orange-100",
    },
  };

  const classes = colorClasses[color] || colorClasses.cyan;

  return (
    <div
      className={`flex items-center space-x-4 p-4 ${classes.bg} rounded-xl ${
        fullWidth ? "md:col-span-2" : ""
      }`}
    >
      <div className={`${classes.iconBg} p-3 rounded-xl`}>
        <Icon className={`w-6 h-6 ${classes.text}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className={`text-lg font-semibold text-slate-800`}>
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ClinicPatientProfile;
