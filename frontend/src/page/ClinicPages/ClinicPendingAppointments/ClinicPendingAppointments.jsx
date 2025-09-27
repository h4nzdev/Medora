"use client";

import { Search, Clock, Users, ChevronDown } from "lucide-react";
import PendingAppointmentsTableBody from "./components/PendingAppointmentsTableBody";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import PendingAppointmentsList from "./components/PendingAppointmentsList";
import { AppointmentContext } from "../../../context/AppointmentContext";

export default function PendingAppointments() {
  const { appointments } = useContext(AppointmentContext);
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  const pendingAppointments = appointments.filter(
    (app) => app.clinicId?._id === user._id && app.status === "pending"
  );

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = pendingAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(
    pendingAppointments.length / appointmentsPerPage
  );

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
            <div className="bg-amber-500 p-3 rounded-2xl shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-800">
                Pending Appointments
              </h1>
              <p className="text-slate-600 mt-1">
                Manage and track all pending patient appointments
              </p>
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
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex items-center h-12 px-4 rounded-xl border border-slate-200 hover:border-cyan-300 bg-transparent text-slate-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Doctor: All
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>

            {/* Add Button */}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block rounded-xl border border-slate-200 overflow-hidden">
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
              <PendingAppointmentsTableBody
                appointments={currentAppointments}
              />
            </table>
          </div>

          {/* Mobile List */}
          <div className="block md:hidden">
            <PendingAppointmentsList appointments={currentAppointments} />
          </div>

          {/* Results Summary */}
          <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
            <p>
              Showing {indexOfFirstAppointment + 1}-
              {Math.min(indexOfLastAppointment, pendingAppointments.length)} of{" "}
              {pendingAppointments.length} appointments
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
