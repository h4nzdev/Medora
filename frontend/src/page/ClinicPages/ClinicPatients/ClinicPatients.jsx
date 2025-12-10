"use client";

import {
  User,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import ClinicPatientsTableBody from "./components/ClinicPatientsTableBody";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import ClinicPatientsList from "./components/ClinicPatientsList";

export default function ClinicPatients() {
  const [patients, setPatients] = useState([]);
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const patientsPerPage = 5;

  const fetchPatients = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/patient/clinic/${user._id}`
      );
      setPatients(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchPatients();
    }
  }, [user]);

  // ADD THIS FUNCTION - It updates the local state when approval changes
  const handleApprovalUpdate = (patientId, newApproval) => {
    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient._id === patientId
          ? { ...patient, approval: newApproval }
          : patient
      )
    );
  };

  const filteredPatients = patients.filter((patient) => {
    const searchTermLower = searchTerm.toLowerCase();
    const patientName = patient.name?.toLowerCase() || "";
    return patientName.includes(searchTermLower);
  });

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

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
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-800">
                Patients
              </h1>
              <p className="text-slate-600 mt-1">
                Manage and view all patient records
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards - UPDATED TO SHOW APPROVAL STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Total Patients
                </p>
                <p className="text-4xl font-semibold text-slate-800">
                  {patients.length}
                </p>
              </div>
              <div className="bg-slate-500 p-4 rounded-2xl shadow-md">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Approved Patients
                </p>
                <p className="text-4xl font-semibold text-emerald-600">
                  {patients.filter((p) => p.approval === "approve").length}
                </p>
              </div>
              <div className="bg-emerald-500 p-4 rounded-2xl shadow-md">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Pending Patients
                </p>
                <p className="text-4xl font-semibold text-amber-600">
                  {
                    patients.filter(
                      (p) => p.approval === "pending" || !p.approval
                    ).length
                  }
                </p>
              </div>
              <div className="bg-amber-500 p-4 rounded-2xl shadow-md">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Rejected Patients
                </p>
                <p className="text-4xl font-semibold text-red-600">
                  {patients.filter((p) => p.approval === "reject").length}
                </p>
              </div>
              <div className="bg-red-500 p-4 rounded-2xl shadow-md">
                <User className="w-8 h-8 text-white" />
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
                  placeholder="Search patients..."
                  className="pl-10 h-12 rounded-xl border border-slate-200 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-200 w-full"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block rounded-xl border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="font-semibold text-slate-700 py-4 px-4">
                    Patient Name
                  </th>
                  <th className="font-semibold text-slate-700 px-4">Age</th>
                  <th className="font-semibold text-slate-700 px-4">Gender</th>
                  <th className="font-semibold text-slate-700 px-4">Phone</th>
                  <th className="font-semibold text-slate-700 px-4">
                    Approval Status
                  </th>{" "}
                  {/* ADD THIS HEADER */}
                  <th className="font-semibold text-slate-700 px-4">Email</th>
                  <th className="font-semibold text-slate-700 px-4">Address</th>
                  <th className="font-semibold text-slate-700 px-4 text-center w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              {/* PASS THE onApprovalUpdate PROP HERE */}
              <ClinicPatientsTableBody
                patients={currentPatients}
                onApprovalUpdate={handleApprovalUpdate}
              />
            </table>
          </div>

          {/* Mobile List */}
          <div className="block md:hidden">
            <ClinicPatientsList
              patients={currentPatients}
              onApprovalUpdate={handleApprovalUpdate} // Pass it here too if needed
            />
          </div>

          {/* Results Summary */}
          <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
            <p>
              Showing {indexOfFirstPatient + 1}-
              {Math.min(indexOfLastPatient, filteredPatients.length)} of{" "}
              {filteredPatients.length} patients
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
