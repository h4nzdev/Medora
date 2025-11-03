import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  DollarSign,
  Users,
  Star,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  BarChart3,
  Shield,
  CreditCard,
} from "lucide-react";

const ClinicDetailsSidebar = ({ clinic, isOpen, onClose }) => {
  // Helper functions
  const getClinicStatus = (clinic) => {
    return clinic.status || "active";
  };

  const getClinicPlan = (clinic) => {
    return clinic.plan || clinic.subscriptionPlan || "free";
  };

  const getJoinDate = (clinic) => {
    return clinic.createdAt || clinic.joinDate || new Date().toISOString();
  };

  const getClinicStats = (clinic) => {
    if (clinic.realStats) {
      return {
        doctors: clinic.realStats.doctors,
        patients: clinic.realStats.patients,
        appointments: clinic.appointmentsCount || 0,
        revenue: clinic.realStats.revenue,
        rating: clinic.rating || 4.0,
      };
    }
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
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        icon: CheckCircle,
      },
      pending: {
        color: "text-amber-600 bg-amber-50 border-amber-200",
        icon: Clock,
      },
      suspended: {
        color: "text-rose-600 bg-rose-50 border-rose-200",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium ${config.color}`}
      >
        <div className="w-2 h-2 rounded-full bg-current"></div>
        <Icon className="w-4 h-4" />
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  const getPlanBadge = (plan) => {
    const planConfig = {
      pro: {
        color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
        icon: Shield,
        label: "Pro Plan",
      },
      basic: {
        color: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
        icon: CreditCard,
        label: "Basic Plan",
      },
      free: {
        color: "bg-gradient-to-r from-slate-500 to-slate-600 text-white",
        icon: CreditCard,
        label: "Free Plan",
      },
    };

    const config = planConfig[plan] || planConfig.free;
    const Icon = config.icon;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${config.color}`}
      >
        <Icon className="w-4 h-4" />
        <span>{config.label}</span>
      </div>
    );
  };

  if (!isOpen || !clinic) return null;

  const stats = getClinicStats(clinic);
  const status = getClinicStatus(clinic);
  const plan = getClinicPlan(clinic);
  const joinDate = getJoinDate(clinic);

  return (
    <AnimatePresence>
      {isOpen && clinic && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Clinic Details
                  </h2>
                  <p className="text-slate-500 text-sm">
                    ID: #{clinic._id?.slice(-6)}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-80px)]">
              {/* Status & Plan */}
              <div className="flex items-center gap-3">
                {getStatusBadge(status)}
                {getPlanBadge(plan)}
              </div>

              {/* Clinic Basic Info */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 bg-cover bg-center border-1 border-cyan-600 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundImage: `url(${clinic.clinicPicture})`,
                    }}
                  ></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg mb-1">
                      {clinic.clinicName || "Unnamed Clinic"}
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-current" />
                        <span className="text-sm font-medium text-slate-700">
                          {stats.rating}
                        </span>
                      </div>
                      <span className="text-slate-400">•</span>
                      <span className="text-sm text-slate-600">
                        Joined {new Date(joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-500" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <User className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-700">
                        {clinic.contactPerson || "Not specified"}
                      </p>
                      <p className="text-sm text-slate-500">Contact Person</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-700">
                        {clinic.email || "Not specified"}
                      </p>
                      <p className="text-sm text-slate-500">Email</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-700">
                        {clinic.phone || "Not specified"}
                      </p>
                      <p className="text-sm text-slate-500">Phone</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-700">
                        {clinic.address || "Not specified"}
                      </p>
                      <p className="text-sm text-slate-500">Address</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-500" />
                  Clinic Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 text-center border border-cyan-200">
                    <Users className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-slate-800">
                      {stats.doctors}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      Doctors
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center border border-blue-200">
                    <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-slate-800">
                      {stats.patients}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      Patients
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 text-center border border-emerald-200">
                    <Calendar className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-slate-800">
                      {stats.appointments}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      Appointments
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 text-center border border-amber-200">
                    <DollarSign className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-slate-800">
                      ₱{stats.revenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      Revenue
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-500" />
                  Additional Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-600">Join Date</span>
                    <span className="font-medium text-slate-800 text-sm">
                      {new Date(joinDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-600">
                      Patient Limit
                    </span>
                    <span className="font-medium text-slate-800 text-sm">
                      {clinic.currentPatientCount || 0} /{" "}
                      {clinic.dailyPatientLimit || "Unlimited"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-600">Clinic ID</span>
                    <span className="font-medium text-slate-800 text-xs">
                      {clinic._id?.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Clinic
                </button>
                <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Reports
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ClinicDetailsSidebar;
