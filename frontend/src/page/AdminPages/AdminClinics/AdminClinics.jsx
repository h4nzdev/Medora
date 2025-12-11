import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Building,
  Users,
  Calendar,
  DollarSign,
  Star,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Trash2,
} from "lucide-react";
import {
  deleteClinic,
  getAllClinics,
  updateClinicStatus,
} from "../../../services/clinic_services/clinicService";
import { getDoctorsByClinic } from "../../../services/doctor_services/doctorService";
import { getPatientsByClinic } from "../../../services/patient_services/patientService";
import { getInvoicesByClinic } from "../../../services/invoiceService";
import ClinicDetailsSidebar from "./components/ClinicDetailsSidebar";
import Swal from "sweetalert2";

const AdminClinics = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Fetch clinics and their real statistics
  const fetchClinics = async () => {
    try {
      setLoading(true);
      const clinicsData = await getAllClinics();
      console.log("📊 Raw clinic data:", clinicsData);

      // Fetch real statistics for each clinic
      const clinicsWithStats = await Promise.all(
        clinicsData.map(async (clinic) => {
          try {
            const doctors = await getDoctorsByClinic(clinic._id);
            const patients = await getPatientsByClinic(clinic._id);
            const invoices = await getInvoicesByClinic(clinic._id);

            const revenue = invoices.reduce((total, invoice) => {
              return total + (invoice.totalAmount || 0);
            }, 0);

            return {
              ...clinic,
              realStats: {
                doctors: doctors.length,
                patients: patients.length,
                revenue: revenue,
              },
            };
          } catch (error) {
            console.error(
              `Error fetching stats for clinic ${clinic._id}:`,
              error
            );
            return {
              ...clinic,
              realStats: {
                doctors: 0,
                patients: 0,
                revenue: 0,
              },
            };
          }
        })
      );

      setClinics(clinicsWithStats);
    } catch (error) {
      console.error("Error fetching clinics:", error);
      Swal.fire("Error!", "Failed to load clinics.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedClinic(null);
  };

  // Status update handler
  const handleUpdateStatus = async (clinicId, newStatus) => {
    try {
      const clinic = clinics.find((c) => c._id === clinicId);
      const currentStatus = clinic?.status || "pending";

      if (currentStatus === newStatus) {
        setOpenDropdown(null);
        return;
      }

      const result = await Swal.fire({
        title: "Update Status",
        text: `Change clinic status from ${currentStatus} to ${newStatus}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await updateClinicStatus(clinicId, newStatus);

        // Update the clinic in local state
        setClinics((prevClinics) =>
          prevClinics.map((clinic) =>
            clinic._id === clinicId ? { ...clinic, status: newStatus } : clinic
          )
        );

        setOpenDropdown(null);

        Swal.fire(
          "Success!",
          `Clinic status updated to ${newStatus}.`,
          "success"
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error!", "Failed to update clinic status.", "error");
    }
  };

  // Status options configuration
  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "text-amber-600",
      bg: "bg-amber-50",
      icon: Clock,
      description: "Awaiting approval",
    },
    {
      value: "approved",
      label: "Approved",
      color: "text-green-600",
      bg: "bg-green-50",
      icon: CheckCircle,
      description: "Active and approved",
    },
    {
      value: "rejected",
      label: "Rejected",
      color: "text-red-600",
      bg: "bg-red-50",
      icon: XCircle,
      description: "Registration rejected",
    },
  ];

  // Get status badge component
  const getStatusBadge = (status, clinicId) => {
    const option =
      statusOptions.find((opt) => opt.value === status) || statusOptions[0];
    const Icon = option.icon;

    return (
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenDropdown(openDropdown === clinicId ? null : clinicId);
          }}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            option.bg
          } ${option.color} border ${option.color.replace(
            "text-",
            "border-"
          )} border-opacity-30 hover:opacity-90 transition-opacity`}
        >
          <Icon className="w-4 h-4" />
          {option.label}
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* Dropdown Menu */}
        {openDropdown === clinicId && (
          <div className="absolute top-full left-0 mt-1 z-[9999] w-56 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-2">
              <div className="text-xs font-medium text-slate-500 px-3 py-2">
                Change Status:
              </div>
              {statusOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateStatus(clinicId, option.value);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-colors hover:bg-slate-50 ${
                      status === option.value ? option.bg : ""
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${option.bg}`}>
                      <Icon className={`w-4 h-4 ${option.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${option.color}`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-slate-500">
                        {option.description}
                      </div>
                    </div>
                    {status === option.value && (
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="border-t border-slate-100 p-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(null);
                }}
                className="w-full text-sm text-slate-600 hover:text-slate-800 px-3 py-2 text-left rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".status-dropdown-container")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Handle view details
  const handleViewDetails = (clinic) => {
    setSelectedClinic(clinic);
    setIsSidebarOpen(true);
  };

  // Handle delete clinic
  const handleDeleteClinic = async (clinicId, clinicName) => {
    const result = await Swal.fire({
      title: "Delete Clinic?",
      text: `Are you sure you want to delete ${clinicName}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteClinic(clinicId);
        setClinics(clinics.filter((c) => c._id !== clinicId));
        Swal.fire("Deleted!", `${clinicName} has been deleted.`, "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete clinic.", "error");
        console.error(error);
      }
    }
  };

  // Filter clinics
  const filteredClinics = clinics.filter((clinic) => {
    const matchesSearch =
      clinic.clinicName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || clinic.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: clinics.length,
    approved: clinics.filter((c) => c.status === "approved").length,
    pending: clinics.filter((c) => c.status === "pending").length,
    rejected: clinics.filter((c) => c.status === "rejected").length,
    pro: clinics.filter((c) => c.subscriptionPlan === "pro").length,
    basic: clinics.filter((c) => c.subscriptionPlan === "basic").length,
    free: clinics.filter(
      (c) => c.subscriptionPlan === "free" || !c.subscriptionPlan
    ).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading clinics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Clinic Management
              </h1>
              <p className="text-slate-600">
                Manage all healthcare clinics on the platform
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">
              {stats.total}
            </div>
            <div className="text-slate-600 text-sm">Total Clinics</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
            <div className="text-slate-600 text-sm">Approved</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-amber-600">
              {stats.pending}
            </div>
            <div className="text-slate-600 text-sm">Pending</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
            <div className="text-slate-600 text-sm">Rejected</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-purple-600">
              {stats.pro}
            </div>
            <div className="text-slate-600 text-sm">Pro Plan</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-slate-600">
              {stats.free}
            </div>
            <div className="text-slate-600 text-sm">Free Plan</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search clinics, contact persons, emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>

              <button className="px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-600" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Clinics Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-6 font-semibold text-slate-700">
                    Clinic Information
                  </th>
                  <th className="text-left p-6 font-semibold text-slate-700">
                    Contact
                  </th>
                  <th className="text-left p-6 font-semibold text-slate-700">
                    Subscription
                  </th>
                  <th className="text-left p-6 font-semibold text-slate-700">
                    Statistics
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
                {filteredClinics.map((clinic) => {
                  const stats = clinic.realStats || {
                    doctors: 0,
                    patients: 0,
                    revenue: 0,
                  };

                  return (
                    <tr
                      key={clinic._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            {clinic.clinicPicture ? (
                              <img
                                src={clinic.clinicPicture}
                                alt={clinic.clinicName}
                                className="w-14 h-14 rounded-xl object-cover border-2 border-cyan-600"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center border-2 border-cyan-600">
                                <Building className="w-8 h-8 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800">
                              {clinic.clinicName || "Unnamed Clinic"}
                            </h3>
                            <p className="text-slate-600 text-sm flex items-center gap-1 mt-1">
                              <MapPin className="w-4 h-4" />
                              {clinic.address || "No address provided"}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-slate-600">
                                Joined{" "}
                                {new Date(
                                  clinic.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="space-y-2">
                          <p className="font-medium text-slate-800">
                            {clinic.contactPerson || "No contact person"}
                          </p>
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Mail className="w-4 h-4" />
                            {clinic.email || "No email"}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Phone className="w-4 h-4" />
                            {clinic.phone || "No phone"}
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              clinic.subscriptionPlan === "pro"
                                ? "bg-purple-100 text-purple-800"
                                : clinic.subscriptionPlan === "basic"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {clinic.subscriptionPlan
                              ? clinic.subscriptionPlan
                                  .charAt(0)
                                  .toUpperCase() +
                                clinic.subscriptionPlan.slice(1)
                              : "Free"}
                          </span>
                          <div className="text-sm text-slate-600">
                            {clinic.subscriptionStatus || "Inactive"}
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="flex items-center gap-1 text-slate-600">
                              <Users className="w-4 h-4" />
                              Doctors
                            </div>
                            <div className="font-semibold text-slate-800">
                              {stats.doctors}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-slate-600">
                              <Users className="w-4 h-4" />
                              Patients
                            </div>
                            <div className="font-semibold text-slate-800">
                              {stats.patients}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-slate-600">
                              <Calendar className="w-4 h-4" />
                              Appointments
                            </div>
                            <div className="font-semibold text-slate-800">
                              {clinic.appointmentsCount || 0}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-slate-600">
                              <DollarSign className="w-4 h-4" />
                              Revenue
                            </div>
                            <div className="font-semibold text-slate-800">
                              ₱{stats.revenue.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="status-dropdown-container">
                          {getStatusBadge(
                            clinic.status || "pending",
                            clinic._id
                          )}
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(clinic)}
                            className="p-2 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteClinic(clinic._id, clinic.clinicName)
                            }
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Clinic"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredClinics.length === 0 && (
            <div className="text-center py-12">
              <Building className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                No clinics found
              </h3>
              <p className="text-slate-500">
                {clinics.length === 0
                  ? "No clinics registered yet"
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          )}
        </div>
      </div>

      <ClinicDetailsSidebar
        clinic={selectedClinic}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        onStatusUpdate={(clinicId, newStatus) => {
          handleUpdateStatus(clinicId, newStatus);
          if (selectedClinic?._id === clinicId) {
            setSelectedClinic((prev) => ({ ...prev, status: newStatus }));
          }
        }}
      />
    </div>
  );
};

export default AdminClinics;
