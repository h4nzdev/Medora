import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
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
} from "lucide-react";
import {
  deleteClinic,
  getAllClinics,
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
  const [clinicStats, setClinicStats] = useState({}); // Store real stats for each clinic

  const [selectedClinic, setSelectedClinic] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleViewDetails = (clinic) => {
    setSelectedClinic(clinic);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedClinic(null);
  };

  const handleDeleteClinic = async (clinic) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete ${clinic.clinicName}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteClinic(clinic._id);
        // Remove from local state
        setClinics(clinics.filter((c) => c._id !== clinic._id));

        Swal.fire(
          "Deleted!",
          `${clinic.clinicName} has been deleted.`,
          "success"
        );
      } catch (error) {
        Swal.fire("Error!", "Failed to delete clinic.", "error");
        console.error(error);
      }
    }
  };

  // Fetch clinics and their real statistics
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
            // Get real doctors count
            const doctors = await getDoctorsByClinic(clinic._id);
            const doctorsCount = doctors.length;

            // Get real patients count
            const patients = await getPatientsByClinic(clinic._id);
            const patientsCount = patients.length;

            // Get real revenue from invoices
            const invoices = await getInvoicesByClinic(clinic._id);
            const revenue = invoices.reduce((total, invoice) => {
              return total + (invoice.totalAmount || 0);
            }, 0);

            return {
              ...clinic,
              realStats: {
                doctors: doctorsCount,
                patients: patientsCount,
                revenue: revenue,
                // Add other real stats as needed
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  // Helper to get status (use real data from database)
  const getClinicStatus = (clinic) => {
    return clinic.status || "active";
  };

  // Helper to get subscription plan (use real data from database)
  const getClinicPlan = (clinic) => {
    return clinic.plan || clinic.subscriptionPlan || "free";
  };

  // Helper to get join date (use real data from database)
  const getJoinDate = (clinic) => {
    return clinic.createdAt || clinic.joinDate || new Date().toISOString();
  };

  // Get real statistics for clinic
  const getClinicStats = (clinic) => {
    // Use real stats if available, otherwise use basic data from clinic
    if (clinic.realStats) {
      return {
        doctors: clinic.realStats.doctors,
        patients: clinic.realStats.patients,
        appointments: clinic.appointmentsCount || 0, // You can add real appointments later
        revenue: clinic.realStats.revenue,
        rating: clinic.rating || 4.0, // Use real rating if available
      };
    }

    // Fallback to clinic data
    return {
      doctors: clinic.doctorsCount || 0,
      patients: clinic.patientsCount || 0,
      appointments: clinic.appointmentsCount || 0,
      revenue: clinic.revenue || 0,
      rating: clinic.rating || 4.0,
    };
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      },
      pending: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: Clock,
      },
      suspended: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.active;
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

  const getPlanBadge = (plan) => {
    const planConfig = {
      pro: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        label: "Pro",
      },
      basic: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Basic",
      },
      free: {
        color: "bg-slate-100 text-slate-800 border-slate-200",
        label: "Free",
      },
    };

    const config = planConfig[plan] || planConfig.free;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const filteredClinics = clinics.filter((clinic) => {
    const matchesSearch =
      clinic.clinicName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || getClinicStatus(clinic) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate real statistics from database
  const stats = {
    total: clinics.length,
    active: clinics.filter((c) => getClinicStatus(c) === "active").length,
    pending: clinics.filter((c) => getClinicStatus(c) === "pending").length,
    pro: clinics.filter((c) => getClinicPlan(c) === "pro").length,
    basic: clinics.filter((c) => getClinicPlan(c) === "basic").length,
    free: clinics.filter((c) => getClinicPlan(c) === "free").length,
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
                Manage all healthcare clinics on the Medora platform
              </p>
            </div>
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors">
              <Plus className="w-5 h-5" />
              Add New Clinic
            </button>
          </div>
        </div>

        {/* Stats Overview - Using Real Data */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">
              {stats.total}
            </div>
            <div className="text-slate-600 text-sm">Total Clinics</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <div className="text-slate-600 text-sm">Active</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-amber-600">
              {stats.pending}
            </div>
            <div className="text-slate-600 text-sm">Pending</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-purple-600">
              {stats.pro}
            </div>
            <div className="text-slate-600 text-sm">Pro Plan</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
            <div className="text-2xl font-bold text-blue-600">
              {stats.basic}
            </div>
            <div className="text-slate-600 text-sm">Basic Plan</div>
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
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>

              <button className="px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-600" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Clinics Table - Using Real Data */}
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
                  const status = getClinicStatus(clinic);
                  const plan = getClinicPlan(clinic);
                  const joinDate = getJoinDate(clinic);
                  const stats = getClinicStats(clinic);

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
                              <Star className="w-4 h-4 text-amber-500 fill-current" />
                              <span className="text-sm text-slate-700">
                                {stats.rating}
                              </span>
                              <span className="text-slate-500">•</span>
                              <span className="text-sm text-slate-600">
                                Joined {new Date(joinDate).toLocaleDateString()}
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
                          {getPlanBadge(plan)}
                          <div className="text-sm text-slate-600">
                            Patients: {clinic.currentPatientCount || 0}/
                            {clinic.dailyPatientLimit || "Unlimited"}
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
                              {stats.appointments}
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

                      <td className="p-6">{getStatusBadge(status)}</td>

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
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Clinic"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClinic(clinic)} // Pass the whole clinic object, not just clinic._id
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Clinic"
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
        stats={stats}
      />
    </div>
  );
};

export default AdminClinics;
