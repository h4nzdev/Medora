import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Building,
} from "lucide-react";

const AdminPatients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clinicFilter, setClinicFilter] = useState("all");

  // Static patient data based on Medora structure
  const patients = [
    {
      _id: "1",
      name: "Maria Santos",
      age: 32,
      gender: "female",
      phone: "+63 912 345 6789",
      email: "maria.santos@email.com",
      address: "123 Main St, Quezon City",
      clinic: "MedPlus Medical Center",
      clinicId: "clinic1",
      lastAppointment: "2024-10-14",
      nextAppointment: "2024-11-15",
      totalAppointments: 8,
      status: "active",
      medicalRecords: 5,
      joinDate: "2024-01-15",
    },
    {
      _id: "2",
      name: "Juan Dela Cruz",
      age: 45,
      gender: "male",
      phone: "+63 917 654 3210",
      email: "juan.dc@email.com",
      address: "456 Oak Ave, Makati",
      clinic: "City Health Clinic",
      clinicId: "clinic2",
      lastAppointment: "2024-10-12",
      nextAppointment: "2024-11-10",
      totalAppointments: 12,
      status: "active",
      medicalRecords: 8,
      joinDate: "2024-02-10",
    },
    {
      _id: "3",
      name: "Anna Reyes",
      age: 28,
      gender: "female",
      phone: "+63 918 777 8888",
      email: "anna.reyes@email.com",
      address: "789 Pine St, Mandaluyong",
      clinic: "Family Care Clinic",
      clinicId: "clinic3",
      lastAppointment: "2024-10-10",
      nextAppointment: null,
      totalAppointments: 3,
      status: "inactive",
      medicalRecords: 2,
      joinDate: "2024-03-05",
    },
    {
      _id: "4",
      name: "Michael Tan",
      age: 55,
      gender: "male",
      phone: "+63 919 555 6666",
      email: "michael.tan@email.com",
      address: "321 Elm Blvd, Manila",
      clinic: "Wellness Center Manila",
      clinicId: "clinic4",
      lastAppointment: "2024-10-08",
      nextAppointment: "2024-10-25",
      totalAppointments: 15,
      status: "active",
      medicalRecords: 12,
      joinDate: "2024-01-28",
    },
    {
      _id: "5",
      name: "Sarah Lim",
      age: 38,
      gender: "female",
      phone: "+63 920 444 3333",
      email: "sarah.lim@email.com",
      address: "654 Maple Tower, Taguig",
      clinic: "Metro Dental Clinic",
      clinicId: "clinic5",
      lastAppointment: "2024-09-20",
      nextAppointment: null,
      totalAppointments: 6,
      status: "pending",
      medicalRecords: 4,
      joinDate: "2024-02-20",
    },
    {
      _id: "6",
      name: "Robert Garcia",
      age: 29,
      gender: "male",
      phone: "+63 921 333 2222",
      email: "robert.g@email.com",
      address: "987 Cedar Lane, Pasig",
      clinic: "MedPlus Medical Center",
      clinicId: "clinic1",
      lastAppointment: "2024-10-13",
      nextAppointment: "2024-11-05",
      totalAppointments: 4,
      status: "active",
      medicalRecords: 3,
      joinDate: "2024-04-15",
    },
    {
      _id: "7",
      name: "Lisa Gomez",
      age: 41,
      gender: "female",
      phone: "+63 922 111 2222",
      email: "lisa.gomez@email.com",
      address: "555 Birch Road, San Juan",
      clinic: "City Health Clinic",
      clinicId: "clinic2",
      lastAppointment: "2024-10-11",
      nextAppointment: "2024-11-20",
      totalAppointments: 7,
      status: "active",
      medicalRecords: 5,
      joinDate: "2024-05-20",
    },
    {
      _id: "8",
      name: "Carlos Rodriguez",
      age: 33,
      gender: "male",
      phone: "+63 923 999 8888",
      email: "carlos.r@email.com",
      address: "777 Spruce Ave, Paranaque",
      clinic: "Wellness Center Manila",
      clinicId: "clinic4",
      lastAppointment: "2024-10-09",
      nextAppointment: "2024-11-12",
      totalAppointments: 9,
      status: "active",
      medicalRecords: 6,
      joinDate: "2024-06-10",
    },
  ];

  // Extract unique clinics for filter dropdown
  const clinics = useMemo(() => {
    const clinicSet = new Set(patients.map((patient) => patient.clinic));
    return Array.from(clinicSet).sort();
  }, [patients]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      },
      inactive: {
        color: "bg-slate-100 text-slate-800 border-slate-200",
        icon: Clock,
      },
      pending: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: Clock,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getGenderBadge = (gender) => {
    const genderConfig = {
      male: { color: "bg-blue-100 text-blue-800 border-blue-200" },
      female: { color: "bg-pink-100 text-pink-800 border-pink-200" },
      other: { color: "bg-purple-100 text-purple-800 border-purple-200" },
    };

    const config = genderConfig[gender] || genderConfig.other;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        {gender.charAt(0).toUpperCase() + gender.slice(1)}
      </span>
    );
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.clinic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || patient.status === statusFilter;
    const matchesClinic =
      clinicFilter === "all" || patient.clinic === clinicFilter;

    return matchesSearch && matchesStatus && matchesClinic;
  });

  // Calculate stats based on current filters
  const stats = useMemo(() => {
    const filtered = patients.filter((patient) => {
      const matchesClinic =
        clinicFilter === "all" || patient.clinic === clinicFilter;
      return matchesClinic;
    });

    return {
      total: filtered.length,
      active: filtered.filter((p) => p.status === "active").length,
      inactive: filtered.filter((p) => p.status === "inactive").length,
      pending: filtered.filter((p) => p.status === "pending").length,
      withUpcoming: filtered.filter((p) => p.nextAppointment !== null).length,
      totalAppointments: filtered.reduce(
        (sum, p) => sum + p.totalAppointments,
        0
      ),
    };
  }, [patients, clinicFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return "No appointment";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Patient Management
              </h1>
              <p className="text-slate-600">
                Manage all patients across the Medora platform
                {clinicFilter !== "all" && (
                  <span className="text-cyan-600 font-medium">
                    {" "}
                    • Filtered by: {clinicFilter}
                  </span>
                )}
              </p>
            </div>
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors">
              <Plus className="w-5 h-5" />
              Add New Patient
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">
              {stats.total}
            </div>
            <div className="text-slate-600 text-sm">Total Patients</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <div className="text-slate-600 text-sm">Active</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-slate-600">
              {stats.inactive}
            </div>
            <div className="text-slate-600 text-sm">Inactive</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-amber-600">
              {stats.pending}
            </div>
            <div className="text-slate-600 text-sm">Pending</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-blue-600">
              {stats.withUpcoming}
            </div>
            <div className="text-slate-600 text-sm">Upcoming Appointments</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalAppointments}
            </div>
            <div className="text-slate-600 text-sm">Total Appointments</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patients, emails, phones, clinics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={clinicFilter}
                onChange={(e) => setClinicFilter(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Clinics</option>
                {clinics.map((clinic) => (
                  <option key={clinic} value={clinic}>
                    {clinic}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setClinicFilter("all");
                }}
                className="px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Filter className="w-5 h-5 text-slate-600" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-6 font-semibold text-slate-700">
                    Patient Information
                  </th>
                  <th className="text-left p-6 font-semibold text-slate-700">
                    Contact Details
                  </th>
                  <th className="text-left p-6 font-semibold text-slate-700">
                    Clinic & Appointments
                  </th>
                  <th className="text-left p-6 font-semibold text-slate-700">
                    Medical History
                  </th>
                  <th className="text-left p-6 font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="text-left p-6 font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">
                            {patient.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            {getGenderBadge(patient.gender)}
                            <span className="text-sm text-slate-600">
                              Age: {patient.age}
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            {patient.address}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{patient.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{patient.email}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-2">
                          Joined {formatDate(patient.joinDate)}
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Building className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {patient.clinic}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-slate-600">Last Visit</div>
                            <div className="font-semibold text-slate-800">
                              {formatDate(patient.lastAppointment)}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-600">
                              Next Appointment
                            </div>
                            <div
                              className={`font-semibold ${
                                patient.nextAppointment
                                  ? "text-cyan-600"
                                  : "text-slate-500"
                              }`}
                            >
                              {formatDate(patient.nextAppointment)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-600" />
                          <span className="text-sm text-slate-700">
                            <span className="font-semibold">
                              {patient.totalAppointments}
                            </span>{" "}
                            appointments
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-600" />
                          <span className="text-sm text-slate-700">
                            <span className="font-semibold">
                              {patient.medicalRecords}
                            </span>{" "}
                            medical records
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">{getStatusBadge(patient.status)}</td>

                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                          title="View Medical Records"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Patient"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Patient"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title="More Options"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                No patients found
              </h3>
              <p className="text-slate-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Clinic Summary */}
        {clinicFilter === "all" && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mt-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Patients by Clinic
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {clinics.map((clinic) => {
                const clinicPatients = patients.filter(
                  (p) => p.clinic === clinic
                );
                const activePatients = clinicPatients.filter(
                  (p) => p.status === "active"
                ).length;

                return (
                  <div
                    key={clinic}
                    className="bg-slate-50 rounded-xl p-4 border border-slate-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800 text-sm">
                          {clinic}
                        </h3>
                        <p className="text-slate-600 text-xs mt-1">
                          {clinicPatients.length} patients
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-semibold">
                          {activePatients}
                        </div>
                        <div className="text-slate-500 text-xs">active</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setClinicFilter(clinic)}
                      className="w-full mt-3 text-cyan-600 text-sm font-medium hover:text-cyan-700 transition-colors"
                    >
                      View patients →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPatients;
