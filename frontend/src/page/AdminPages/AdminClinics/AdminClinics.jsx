import React, { useState } from "react";
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

const AdminClinics = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Static clinic data based on Medora structure
  const clinics = [
    {
      _id: "1",
      clinicName: "MedPlus Medical Center",
      contactPerson: "Dr. Sarah Lim",
      email: "sarah.lim@medplus.com",
      phone: "+63 912 345 6789",
      address: "123 Medical Plaza, Quezon City",
      subscriptionPlan: "pro",
      dailyPatientLimit: 50,
      currentPatientCount: 38,
      status: "active",
      doctors: 12,
      patients: 245,
      appointments: 156,
      revenue: 1250000,
      rating: 4.8,
      joinDate: "2024-01-15",
    },
    {
      _id: "2",
      clinicName: "City Health Clinic",
      contactPerson: "Dr. Michael Tan",
      email: "m.tan@cityhealth.com",
      phone: "+63 917 654 3210",
      address: "456 Health Ave, Makati",
      subscriptionPlan: "basic",
      dailyPatientLimit: 30,
      currentPatientCount: 22,
      status: "active",
      doctors: 8,
      patients: 189,
      appointments: 98,
      revenue: 850000,
      rating: 4.5,
      joinDate: "2024-02-10",
    },
    {
      _id: "3",
      clinicName: "Family Care Clinic",
      contactPerson: "Dr. Maria Santos",
      email: "maria.santos@familycare.com",
      phone: "+63 918 777 8888",
      address: "789 Care Street, Mandaluyong",
      subscriptionPlan: "free",
      dailyPatientLimit: 20,
      currentPatientCount: 15,
      status: "active",
      doctors: 5,
      patients: 134,
      appointments: 67,
      revenue: 450000,
      rating: 4.2,
      joinDate: "2024-03-05",
    },
    {
      _id: "4",
      clinicName: "Wellness Center Manila",
      contactPerson: "Dr. James Cruz",
      email: "j.cruz@wellnessmanila.com",
      phone: "+63 919 555 6666",
      address: "321 Wellness Blvd, Manila",
      subscriptionPlan: "pro",
      dailyPatientLimit: 50,
      currentPatientCount: 42,
      status: "pending",
      doctors: 15,
      patients: 312,
      appointments: 201,
      revenue: 1680000,
      rating: 4.9,
      joinDate: "2024-01-28",
    },
    {
      _id: "5",
      clinicName: "Metro Dental Clinic",
      contactPerson: "Dr. Anna Reyes",
      email: "anna.reyes@metrodental.com",
      phone: "+63 920 444 3333",
      address: "654 Dental Tower, Taguig",
      subscriptionPlan: "basic",
      dailyPatientLimit: 25,
      currentPatientCount: 18,
      status: "suspended",
      doctors: 6,
      patients: 167,
      appointments: 89,
      revenue: 720000,
      rating: 4.3,
      joinDate: "2024-02-20",
    },
  ];

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
      clinic.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || clinic.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: clinics.length,
    active: clinics.filter((c) => c.status === "active").length,
    pending: clinics.filter((c) => c.status === "pending").length,
    pro: clinics.filter((c) => c.subscriptionPlan === "pro").length,
    basic: clinics.filter((c) => c.subscriptionPlan === "basic").length,
    free: clinics.filter((c) => c.subscriptionPlan === "free").length,
  };

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
                {filteredClinics.map((clinic) => (
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
                            {clinic.clinicName}
                          </h3>
                          <p className="text-slate-600 text-sm flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            {clinic.address}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                            <span className="text-sm text-slate-700">
                              {clinic.rating}
                            </span>
                            <span className="text-slate-500">•</span>
                            <span className="text-sm text-slate-600">
                              Joined{" "}
                              {new Date(clinic.joinDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="space-y-2">
                        <p className="font-medium text-slate-800">
                          {clinic.contactPerson}
                        </p>
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                          <Mail className="w-4 h-4" />
                          {clinic.email}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                          <Phone className="w-4 h-4" />
                          {clinic.phone}
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="space-y-2">
                        {getPlanBadge(clinic.subscriptionPlan)}
                        <div className="text-sm text-slate-600">
                          Limit: {clinic.currentPatientCount}/
                          {clinic.dailyPatientLimit}
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
                            {clinic.doctors}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-slate-600">
                            <Users className="w-4 h-4" />
                            Patients
                          </div>
                          <div className="font-semibold text-slate-800">
                            {clinic.patients}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-slate-600">
                            <Calendar className="w-4 h-4" />
                            Appointments
                          </div>
                          <div className="font-semibold text-slate-800">
                            {clinic.appointments}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-slate-600">
                            <DollarSign className="w-4 h-4" />
                            Revenue
                          </div>
                          <div className="font-semibold text-slate-800">
                            ₱{(clinic.revenue / 1000).toFixed(0)}K
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">{getStatusBadge(clinic.status)}</td>

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
                ))}
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
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminClinics;
