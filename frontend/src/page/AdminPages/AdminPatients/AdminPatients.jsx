import React, { useState, useMemo, useEffect } from "react";
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
  FileText,
  CheckCircle,
  Clock,
  Building,
} from "lucide-react";
import {
  getAllPatients,
  deletePatient,
  getPatientsByClinic,
} from "../../../services/patient_services/patientService";
import { getAllClinics } from "../../../services/clinic_services/clinicService";
import { getAppointmentsByPatient } from "../../../services/appointmentService";
import { getMedicalRecordsByPatient } from "../../../services/medicalrecords_services/recordsServices";
import PatientDetailsSidebar from "./components/PatientDetailsSidebar";

const AdminPatients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clinicFilter, setClinicFilter] = useState("all");
  const [patients, setPatients] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Safe mock data as fallback
  const getMockPatients = () => [
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
  ];

  // Fetch clinics (only once on mount)
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const clinicsData = await getAllClinics();
        setClinics(clinicsData);
      } catch (err) {
        console.error("Error fetching clinics:", err);
        setClinics([]);
      }
    };

    fetchClinics();
  }, []);

  // Fetch patients based on clinic filter
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        let patientsData;

        if (clinicFilter === "all") {
          // Fetch all patients
          patientsData = await getAllPatients();
        } else {
          // Fetch patients by specific clinic
          patientsData = await getPatientsByClinic(clinicFilter);
        }

        // Validate and process patients data
        if (Array.isArray(patientsData)) {
          // For each patient, find their clinic name
          const patientsWithClinicNames = patientsData.map((patient) => {
            const clinic = clinics.find((c) => c._id === patient.clinicId);
            return {
              ...patient,
              clinic: clinic ? clinic.clinicName : "Unknown Clinic",
              // Add mock data for demonstration (you'll replace this with real data)
              lastAppointment: patient.lastAppointment || "2024-10-14",
              nextAppointment: patient.nextAppointment || "2024-11-15",
              totalAppointments: patient.totalAppointments || 0,
              status: patient.status || "active",
              medicalRecords: patient.medicalRecords || 0,
              joinDate: patient.createdAt || "2024-01-15",
            };
          });

          setPatients(patientsWithClinicNames);
        } else {
          throw new Error("Invalid patients data format");
        }
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Failed to load data. Using demo data.");
        setPatients(getMockPatients());
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [clinicFilter, clinics]); // Re-fetch when clinicFilter changes

  // Safe delete handler
  const handleDeletePatient = async (patientId) => {
    if (!patientId) {
      console.error("No patient ID provided for deletion");
      return;
    }

    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await deletePatient(patientId);
        // Refetch patients after deletion to update the list
        if (clinicFilter === "all") {
          const updatedPatients = await getAllPatients();
          setPatients(updatedPatients);
        } else {
          const updatedPatients = await getPatientsByClinic(clinicFilter);
          setPatients(updatedPatients);
        }
      } catch (err) {
        console.error("Error deleting patient:", err);
        alert("Failed to delete patient. Please try again.");
      }
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setIsSidebarOpen(true);
  };

  // Close sidebar
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedPatient(null);
  };

  // Safe data access helpers
  const safeString = (str) => (str || "").toString().toLowerCase();
  const safeArray = (arr) => (Array.isArray(arr) ? arr : []);

  // Extract unique clinics safely from actual clinics data
  const clinicOptions = useMemo(() => {
    try {
      return safeArray(clinics).map((clinic) => ({
        value: clinic._id,
        label: clinic.clinicName,
      }));
    } catch (err) {
      console.error("Error processing clinics:", err);
      return [];
    }
  }, [clinics]);

  // Get clinic name by ID - FIXED VERSION
  const getClinicName = (clinicId) => {
    if (!clinicId) return "Unknown Clinic";

    // Handle the case where clinicId is an object with _id property
    let actualClinicId;
    if (typeof clinicId === "object" && clinicId._id) {
      actualClinicId = clinicId._id;
    } else {
      actualClinicId = clinicId;
    }

    const clinic = clinics.find(
      (c) => c._id.toString() === actualClinicId.toString()
    );

    return clinic ? clinic.clinicName : "Unknown Clinic";
  };

  // Safe status badge
  const getStatusBadge = (status) => {
    const safeStatus = status || "pending";

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

    const config = statusConfig[safeStatus] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
      </span>
    );
  };

  // Safe gender badge
  const getGenderBadge = (gender) => {
    const safeGender = gender || "other";

    const genderConfig = {
      male: { color: "bg-blue-100 text-blue-800 border-blue-200" },
      female: { color: "bg-pink-100 text-pink-800 border-pink-200" },
      other: { color: "bg-purple-100 text-purple-800 border-purple-200" },
    };

    const config = genderConfig[safeGender] || genderConfig.other;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        {safeGender.charAt(0).toUpperCase() + safeGender.slice(1)}
      </span>
    );
  };

  // Safe patient filtering - now only for search and status (clinic filtering is done via API)
  const filteredPatients = useMemo(() => {
    try {
      return safeArray(patients).filter((patient) => {
        if (!patient || typeof patient !== "object") return false;

        const searchLower = safeString(searchTerm);
        const matchesSearch =
          safeString(patient.name).includes(searchLower) ||
          safeString(patient.email).includes(searchLower) ||
          safeString(patient.phone).includes(searchLower) ||
          safeString(getClinicName(patient.clinicId)).includes(searchLower);

        const matchesStatus =
          statusFilter === "all" || patient.status === statusFilter;

        return matchesSearch && matchesStatus;
      });
    } catch (err) {
      console.error("Error filtering patients:", err);
      return [];
    }
  }, [patients, searchTerm, statusFilter, clinics]);

  // Safe stats calculation
  const stats = useMemo(() => {
    try {
      const filtered = safeArray(patients);

      const defaultStats = {
        total: 0,
        active: 0,
        inactive: 0,
        pending: 0,
        withUpcoming: 0,
        totalAppointments: 0,
      };

      return filtered.reduce((acc, patient) => {
        if (!patient) return acc;

        return {
          total: acc.total + 1,
          active: acc.active + (patient.status === "active" ? 1 : 0),
          inactive: acc.inactive + (patient.status === "inactive" ? 1 : 0),
          pending: acc.pending + (patient.status === "pending" ? 1 : 0),
          withUpcoming: acc.withUpcoming + (patient.nextAppointment ? 1 : 0),
          totalAppointments:
            acc.totalAppointments + (patient.totalAppointments || 0),
        };
      }, defaultStats);
    } catch (err) {
      console.error("Error calculating stats:", err);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        pending: 0,
        withUpcoming: 0,
        totalAppointments: 0,
      };
    }
  }, [patients]);

  // Safe date formatting
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "No appointment";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Invalid date";
    }
  };

  // Safe patient field access
  const getPatientField = (patient, field, fallback = "N/A") => {
    if (!patient || typeof patient !== "object") return fallback;
    return patient[field] ?? fallback;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-slate-600 mt-4">
            {clinicFilter === "all"
              ? "Loading all patients..."
              : `Loading patients for ${getClinicName(clinicFilter)}...`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                Patient Management
              </h1>
              <p className="text-slate-600">
                {clinicFilter === "all"
                  ? "Manage all patients across the Medora platform"
                  : `Managing patients for ${getClinicName(clinicFilter)}`}
              </p>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-amber-800">
              <Clock className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
          {[
            {
              label: "Total Patients",
              value: stats.total,
              color: "text-slate-800",
            },
            { label: "Active", value: stats.active, color: "text-green-600" },
            {
              label: "Inactive",
              value: stats.inactive,
              color: "text-slate-600",
            },
            { label: "Pending", value: stats.pending, color: "text-amber-600" },
            {
              label: "Upcoming Appointments",
              value: stats.withUpcoming,
              color: "text-blue-600",
            },
            {
              label: "Total Appointments",
              value: stats.totalAppointments,
              color: "text-purple-600",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm border border-slate-200"
            >
              <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-slate-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patients, emails, phones, clinics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={clinicFilter}
                onChange={(e) => setClinicFilter(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Clinics</option>
                {clinicOptions.map((clinic) => (
                  <option key={clinic.value} value={clinic.value}>
                    {clinic.label}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                className="px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 justify-center"
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Rest of your component remains the same */}
        {/* Patients Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {[
                    "Patient Information",
                    "Contact Details",
                    "Clinic & Appointments",
                    "Medical History",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="text-left p-4 sm:p-6 font-semibold text-slate-700 text-sm"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPatients.map((patient) => (
                  <tr
                    key={getPatientField(patient, "_id", "unknown")}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {/* Patient Information */}
                    <td className="p-4 sm:p-6">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          {patient.patientPicture ? (
                            <img
                              src={patient.patientPicture}
                              alt={patient.name}
                              className="w-14 h-14 rounded-xl object-cover border-2 border-cyan-600"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center border-2 border-cyan-600">
                              <User className="w-8 h-8 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-800 truncate">
                            {getPatientField(
                              patient,
                              "name",
                              "Unknown Patient"
                            )}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {getGenderBadge(getPatientField(patient, "gender"))}
                            <span className="text-sm text-slate-600">
                              Age: {getPatientField(patient, "age", "N/A")}
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm flex items-center gap-1 mt-1 truncate">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">
                              {getPatientField(
                                patient,
                                "address",
                                "No address"
                              )}
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Details */}
                    <td className="p-4 sm:p-6">
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm truncate">
                            {getPatientField(patient, "phone", "No phone")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm truncate">
                            {getPatientField(patient, "email", "No email")}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-2">
                          Joined{" "}
                          {formatDate(getPatientField(patient, "joinDate"))}
                        </div>
                      </div>
                    </td>

                    {/* Clinic & Appointments */}
                    <td className="p-4 sm:p-6">
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Building className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm font-medium truncate">
                            {getClinicName(patient.clinicId)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                          <div>
                            <div className="text-slate-600 text-xs">
                              Last Visit
                            </div>
                            <div className="font-semibold text-slate-800 text-sm">
                              {formatDate(
                                getPatientField(patient, "lastAppointment")
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-600 text-xs">
                              Next Appointment
                            </div>
                            <div
                              className={`font-semibold text-sm ${
                                getPatientField(patient, "nextAppointment")
                                  ? "text-cyan-600"
                                  : "text-slate-500"
                              }`}
                            >
                              {formatDate(
                                getPatientField(patient, "nextAppointment")
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Medical History */}
                    <td className="p-4 sm:p-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-600 flex-shrink-0" />
                          <span className="text-sm text-slate-700">
                            <span className="font-semibold">
                              {getPatientField(patient, "totalAppointments", 0)}
                            </span>{" "}
                            appointments
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-600 flex-shrink-0" />
                          <span className="text-sm text-slate-700">
                            <span className="font-semibold">
                              {getPatientField(patient, "medicalRecords", 0)}
                            </span>{" "}
                            medical records
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4 sm:p-6">
                      {getStatusBadge(getPatientField(patient, "status"))}
                    </td>

                    {/* Actions */}
                    <td className="p-4 sm:p-6">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleViewPatient(patient)}
                          className="p-1 sm:p-2 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                          title="View Medical Records"
                        >
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeletePatient(getPatientField(patient, "_id"))
                          }
                          className="p-1 sm:p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Patient"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
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
              <User className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
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
        {clinicFilter === "all" && clinicOptions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mt-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Patients by Clinic
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {clinicOptions.map((clinic) => {
                const clinicPatients = safeArray(patients).filter(
                  (p) => p?.clinicId === clinic.value
                );
                const activePatients = clinicPatients.filter(
                  (p) => p?.status === "active"
                ).length;

                return (
                  <div
                    key={clinic.value}
                    className="bg-slate-50 rounded-xl p-4 border border-slate-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800 text-sm truncate">
                          {clinic.label}
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
                      onClick={() => setClinicFilter(clinic.value)}
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
      <PatientDetailsSidebar
        patient={selectedPatient}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />
    </div>
  );
};

export default AdminPatients;
