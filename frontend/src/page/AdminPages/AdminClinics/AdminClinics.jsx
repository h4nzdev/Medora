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
import { getAllClinics } from "../../../services/clinic_services/clinicService";

const AdminClinics = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const response = await getAllClinics();
      console.log("📊 Raw clinic data:", response); // Debug log
      setClinics(response);
    } catch (error) {
      console.error("Error fetching clinics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  // Helper to get status (fallback to 'active' if not provided)
  const getClinicStatus = (clinic) => {
    return clinic.status || "active";
  };

  // Helper to get subscription plan (fallback to 'free')
  const getClinicPlan = (clinic) => {
    return clinic.subscriptionPlan || "free";
  };

  // Helper to get join date (fallback to createdAt or current date)
  const getJoinDate = (clinic) => {
    return clinic.createdAt || clinic.joinDate || new Date().toISOString();
  };

  // Mock statistics for demo (you can replace with real data later)
  const getClinicStats = (clinic) => {
    return {
      doctors: clinic.doctorsCount || Math.floor(Math.random() * 10) + 1,
      patients: clinic.patientsCount || Math.floor(Math.random() * 50) + 10,
      appointments:
        clinic.appointmentsCount || Math.floor(Math.random() * 100) + 20,
      revenue: clinic.revenue || Math.floor(Math.random() * 50000) + 10000,
      rating: clinic.rating || (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
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
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                            <Building className="w-6 h-6 text-white" />
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
                            {clinic.dailyPatientLimit || 20}
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
                              ₱{(stats.revenue / 1000).toFixed(0)}K
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-6">{getStatusBadge(status)}</td>

                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <button
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
    </div>
  );
};

export default AdminClinics;
