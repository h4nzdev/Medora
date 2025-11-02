"use client";

import {
  Calendar,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  Users,
  ChevronDown,
} from "lucide-react";
import ClinicAppointmentsTableBody from "./components/ClinicAppointmentsTableBody";
import { useContext, useState } from "react";
import { AppointmentContext } from "../../../context/AppointmentContext";
import { AuthContext } from "../../../context/AuthContext";
import ClinicAppointmentsList from "./components/ClinicAppointmentsList";
import { Link } from "react-router-dom";

export default function ClinicAppointments() {
  const { appointments } = useContext(AppointmentContext);
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [isStatusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [isDoctorDropdownOpen, setDoctorDropdownOpen] = useState(false);
  const appointmentsPerPage = 5;

  const doctors = [
    ...new Set(appointments.map((app) => app.doctorId?.name).filter(Boolean)),
  ];
  const statuses = [
    "All",
    "Pending",
    "Accepted",
    "Scheduled",
    "Completed",
    "Cancelled",
    "Rejected",
  ];

  const clinicAppointments = appointments.filter(
    (app) => app.clinicId?._id === user._id
  );

  const filteredAppointments = clinicAppointments
    .filter((app) => {
      if (statusFilter === "All") return true;
      return app.status.toLowerCase() === statusFilter.toLowerCase();
    })
    .filter((app) => {
      if (doctorFilter === "All") return true;
      return app.doctorId?.name === doctorFilter;
    })
    .filter((app) => {
      const searchTermLower = searchTerm.toLowerCase();
      const patientName = app.patientId?.name?.toLowerCase() || "";
      const doctorName = app.doctorId?.name?.toLowerCase() || "";
      return (
        patientName.includes(searchTermLower) ||
        doctorName.includes(searchTermLower)
      );
    });

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage
  );

  const confirmedAppointment = clinicAppointments.filter(
    (app) => app.status === "scheduled"
  );
  const pendingAppointment = clinicAppointments.filter(
    (app) => app.status === "pending"
  );
  const completedAppointment = clinicAppointments.filter(
    (app) => app.status === "completed"
  );

  const getAppointmentLimit = () => {
    if (user?.subscriptionPlan === "free") {
      return 10;
    } else if (user?.subscriptionPlan === "basic") {
      return 20;
    }
    return "Unlimited";
  };

  const appointmentLimit = getAppointmentLimit();

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-800">
                Appointments
              </h1>
              <p className="text-slate-600 mt-1">
                Manage and track all patient appointments
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Total Appointments
                </p>
                <p className="text-4xl font-semibold text-slate-800">
                  {clinicAppointments.length}
                  {appointmentLimit !== "Unlimited" && (
                    <span className="text-lg font-medium text-slate-500">
                      / {appointmentLimit}
                    </span>
                  )}
                </p>
              </div>
              <div className="bg-slate-500 p-4 rounded-2xl shadow-md">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Confirmed
                </p>
                <p className="text-4xl font-semibold text-emerald-600">
                  {confirmedAppointment.length}
                </p>
              </div>
              <div className="bg-emerald-500 p-4 rounded-2xl shadow-md">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Pending
                </p>
                <p className="text-4xl font-semibold text-amber-600">
                  {pendingAppointment.length}
                </p>
              </div>
              <div className="bg-amber-500 p-4 rounded-2xl shadow-md">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Completed
                </p>
                <p className="text-4xl font-semibold text-cyan-600">
                  {completedAppointment.length}
                </p>
              </div>
              <div className="bg-cyan-500 p-4 rounded-2xl shadow-md">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="pl-10 h-12 rounded-xl border border-slate-200 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-200 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="flex items-center h-12 px-4 rounded-xl border border-slate-200 hover:border-cyan-300 bg-transparent text-slate-700"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Status: {statusFilter}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
                  {isStatusDropdownOpen && (
                    <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setStatusFilter(status);
                            setStatusDropdownOpen(false);
                            setCurrentPage(1);
                          }}
                          className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDoctorDropdownOpen(!isDoctorDropdownOpen)}
                    className="flex items-center h-12 px-4 rounded-xl border border-slate-200 hover:border-cyan-300 bg-transparent text-slate-700"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Doctor: {doctorFilter}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
                  {isDoctorDropdownOpen && (
                    <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                      <button
                        onClick={() => {
                          setDoctorFilter("All");
                          setDoctorDropdownOpen(false);
                          setCurrentPage(1);
                        }}
                        className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50"
                      >
                        All
                      </button>
                      {doctors.map((doctor) => (
                        <button
                          key={doctor}
                          onClick={() => {
                            setDoctorFilter(doctor);
                            setDoctorDropdownOpen(false);
                            setCurrentPage(1);
                          }}
                          className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50"
                        >
                          {doctor}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Add Button */}
            <Link
              to="/clinic/add-appointment"
              type="button"
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Appointment
            </Link>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block rounded-xl border border-slate-200 overflow-visible">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="font-semibold text-slate-700 py-4 px-4">
                    Patient
                  </th>
                  <th className="font-semibold text-slate-700 px-4">Doctor</th>
                  <th className="font-semibold text-slate-700 px-4">
                    Date & Time
                  </th>
                  <th className="font-semibold text-slate-700 px-4">Type</th>
                  <th className="font-semibold text-slate-700 px-4">
                    Booking Type
                  </th>
                  <th className="font-semibold text-slate-700 px-4">Status</th>
                  <th className="font-semibold text-slate-700 px-4">Contact</th>
                  <th className="font-semibold text-slate-700 px-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <ClinicAppointmentsTableBody appointments={currentAppointments} />
            </table>
          </div>

          {/* Mobile List */}
          <div className="block md:hidden">
            <ClinicAppointmentsList appointments={currentAppointments} />
          </div>

          {/* Results Summary */}
          <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
            <p>
              Showing {indexOfFirstAppointment + 1}-
              {Math.min(indexOfLastAppointment, filteredAppointments.length)} of{" "}
              {filteredAppointments.length} appointments
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="rounded-lg bg-transparent border border-slate-300 px-3 py-1 text-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className="rounded-lg bg-transparent border border-slate-300 px-3 py-1 text-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
