"use client";

import axios from "axios";
import {
  FileText,
  Plus,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import ClinicMedicalRecordsTableBody from "./components/ClinicMedicalRecordsTableBody";

export default function ClinicMedicalRecords() {
  const [records, setRecords] = useState([]);
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [isFilterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const recordsPerPage = 5;

  const fetchRecords = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/medical-records/clinic/${user._id}`
      );
      setRecords(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    if (user?._id) {
      fetchRecords();
    }
  }, [user]);

  const filteredRecords = records
    .filter((record) => {
      if (filter === "All") return true;
      return record.type.toLowerCase() === filter.toLowerCase();
    })
    .filter((record) => {
      const searchTermLower = searchTerm.toLowerCase();
      const patientName = record.patientId?.name?.toLowerCase() || "";
      const doctorName = record.doctorId?.name?.toLowerCase() || "";
      return (
        patientName.includes(searchTermLower) ||
        doctorName.includes(searchTermLower)
      );
    });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const recordTypes = [
    "All",
    ...new Set(records.map((record) => record.type)),
  ];

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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-800">
                Medical Records
              </h1>
              <p className="text-slate-600 mt-1">
                View and manage patient medical records
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Total Records
                </p>
                <p className="text-4xl font-semibold text-slate-800">
                  {records?.length}
                </p>
              </div>
              <div className="bg-slate-500 p-4 rounded-2xl shadow-md">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Recent Records
                </p>
                <p className="text-4xl font-semibold text-emerald-600">
                  {records?.length}
                </p>
              </div>
              <div className="bg-emerald-500 p-4 rounded-2xl shadow-md">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  Pending Reviews
                </p>
                <p className="text-4xl font-semibold text-amber-600">
                  {records?.length}
                </p>
              </div>
              <div className="bg-amber-500 p-4 rounded-2xl shadow-md">
                <FileText className="w-8 h-8 text-white" />
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
                  placeholder="Search medical records..."
                  className="pl-10 h-12 rounded-xl border border-slate-200 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-200 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFilterDropdownOpen(!isFilterDropdownOpen)}
                  className="flex items-center h-12 px-4 rounded-xl border border-slate-200 hover:border-cyan-300 bg-transparent text-slate-700"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter: {filter}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
                {isFilterDropdownOpen && (
                  <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                    {recordTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setFilter(type);
                          setFilterDropdownOpen(false);
                          setCurrentPage(1);
                        }}
                        className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Add Button */}
            <button
              type="button"
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center"
              disabled
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Record
            </button>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="font-semibold text-slate-700 py-4 px-4">
                    Record ID
                  </th>
                  <th className="font-semibold text-slate-700 px-4">
                    Patient Name
                  </th>
                  <th className="font-semibold text-slate-700 px-4">Date</th>
                  <th className="font-semibold text-slate-700 px-4">Type</th>
                  <th className="font-semibold text-slate-700 px-4">Doctor</th>
                  <th className="font-semibold text-slate-700 px-4">Status</th>
                  <th className="font-semibold text-slate-700 px-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
                <ClinicMedicalRecordsTableBody records={currentRecords} />
            </table>
          </div>

          {/* Results Summary */}
          <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <p>
          Showing {indexOfFirstRecord + 1}-
          {Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length}{" "}
          records
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
