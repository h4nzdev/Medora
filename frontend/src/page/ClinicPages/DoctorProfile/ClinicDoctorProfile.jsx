"use client";

import axios from "axios";
import {
  User,
  Mail,
  Phone,
  Clock,
  Award,
  Stethoscope,
  Badge,
  ArrowLeft,
  Eye,
  Calendar,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDate, useTime } from "../../../utils/date";
import { AppointmentContext } from "../../../context/AppointmentContext";
import { getStatusBadge } from "../../../utils/clientAppointment";

const ClinicDoctorProfile = () => {
  const { appointments } = useContext(AppointmentContext);
  const { id } = useParams();
  const doctorAppointments = appointments?.filter(
    (appointment) => appointment.doctorId?._id === id
  );
  console.log(appointments);
  const [doctor, setDoctor] = useState();
  const navigate = useNavigate();

  const fetchDoctor = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/doctor/${id}`
      );
      setDoctor(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, []);

  console.log(doctor);

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate("/clinic/doctors")}
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
                View Doctor Profile
              </h1>
              <p className="text-slate-600 mt-1">
                Doctor information and details
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-800">
                  Personal Information
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Basic information about the doctor
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-cyan-100 p-3 rounded-xl">
                    <User className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Full Name
                    </p>
                    <p className="text-lg font-semibold text-slate-800">
                      {doctor?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Gender</p>
                    <p className="text-lg font-semibold text-slate-800">
                      {doctor?.gender || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-emerald-100 p-3 rounded-xl">
                    <Award className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Qualification
                    </p>
                    <p className="text-lg font-semibold text-slate-800">
                      {doctor?.qualification || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <Stethoscope className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Specialty
                    </p>
                    <p className="text-lg font-semibold text-slate-800">
                      {doctor?.specialty || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Experience
                    </p>
                    <p className="text-lg font-semibold text-slate-800">
                      {doctor?.experience || "N/A"} Years
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Badge className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Status</p>
                    <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-md text-sm w-fit">
                      {doctor?.status || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mt-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-red-100 p-3 rounded-xl">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Email Address
                    </p>
                    <p className="text-lg font-semibold text-slate-800">
                      {doctor?.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-indigo-100 p-3 rounded-xl">
                    <Phone className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Phone Number
                    </p>
                    <p className="text-lg font-semibold text-slate-800">
                      {doctor?.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Availability Schedule */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-800">
                  Availability Schedule
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Doctor's working schedule
                </p>
              </div>

              {doctor?.availability && doctor.availability.length > 0 ? (
                <div className="space-y-4">
                  {doctor.availability.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-emerald-500 p-3 rounded-xl">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-slate-800">
                            {schedule.day}
                          </p>
                          <p className="text-sm text-slate-600">Working Day</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-emerald-700">
                          {schedule.startTime} - {schedule.endTime}
                        </p>
                        <p className="text-sm text-slate-600">
                          {schedule.startTime === "09:00" &&
                          schedule.endTime === "17:00"
                            ? "Full Day"
                            : "Custom Hours"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-slate-100 p-4 rounded-xl w-fit mx-auto mb-4">
                    <Clock className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-lg">
                    No availability schedule set
                  </p>
                  <p className="text-slate-400 text-sm">
                    Contact the clinic for scheduling information
                  </p>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-800">
                  Account Details
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  System information and metadata
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-slate-100 p-3 rounded-xl">
                    <User className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Doctor ID
                    </p>
                    <p className="text-lg font-semibold text-slate-800">
                      #{doctor?._id || "N/A"}
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
                      {useDate(doctor?.createdAt) || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor's Appointment History */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                Appointment History
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Past and upcoming appointments with patients
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">
                      Patient Name
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
                  {doctorAppointments?.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12">
                        <div className="bg-slate-100 p-4 rounded-xl w-fit mx-auto mb-4">
                          <Calendar className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500 text-lg">
                          No appointments found
                        </p>
                        <p className="text-slate-400 text-sm">
                          This doctor has no scheduled appointments
                        </p>
                      </td>
                    </tr>
                  ) : (
                    doctorAppointments?.map((app) => (
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
                              {app.patientId?.name}
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

export default ClinicDoctorProfile;
