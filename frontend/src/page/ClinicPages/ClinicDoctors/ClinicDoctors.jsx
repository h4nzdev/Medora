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
import ClinicDoctorsTableBody from "./components/ClinicDoctorsTableBody";
import ClinicDoctorsStats from "./components/ClinicDoctorsStats";

import AddDoctorModal from "../../../components/ClinicComponents/AddDoctorModal/AddDoctorModal";
import { useContext, useState } from "react";

export default function ClinicDoctors() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="mx-auto ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-800">
                Doctors
              </h1>
              <p className="text-slate-600 mt-1">
                Manage and view all doctor profiles
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <ClinicDoctorsStats />
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
                  placeholder="Search doctors..."
                  className="pl-10 h-12 rounded-xl border border-slate-200 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-200 w-full"
                  disabled
                />
              </div>

              {/* Filter */}
              <button
                type="button"
                className="flex items-center h-12 px-4 rounded-xl border border-slate-200 hover:border-cyan-300 bg-transparent text-slate-700 cursor-not-allowed"
                disabled
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </div>

            {/* Add Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Doctor
            </button>
          </div>

          {/* Add Doctor Modal */}
          <AddDoctorModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />

          {/* Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="font-semibold text-slate-700 py-4 px-4">
                    Doctor Name
                  </th>
                  <th className="font-semibold text-slate-700 px-4">
                    Specialty
                  </th>
                  <th className="font-semibold text-slate-700 px-4">Phone</th>
                  <th className="font-semibold text-slate-700 px-4">Email</th>
                  <th className="font-semibold text-slate-700 px-4">Status</th>
                  <th className="font-semibold text-slate-700 px-4 text-center w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              <ClinicDoctorsTableBody />
            </table>
          </div>

          {/* Results Summary */}
          <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
            <p>Showing 3 of 6 doctors</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled
                className="rounded-lg bg-transparent border border-slate-300 px-3 py-1 text-slate-400 cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                disabled
                className="rounded-lg bg-transparent border border-slate-300 px-3 py-1 text-slate-400 cursor-not-allowed"
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
