import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  BarChart3,
  Heart,
  Pill,
  Stethoscope,
  AlertCircle,
} from "lucide-react";

const PatientDetailsSidebar = ({ patient, isOpen, onClose }) => {
  // Helper functions
  const getPatientStatus = (patient) => {
    return patient.status || "active";
  };

  const getJoinDate = (patient) => {
    return patient.createdAt || patient.joinDate || new Date().toISOString();
  };

  const getPatientStats = (patient) => {
    return {
      appointments: patient.totalAppointments || 0,
      medicalRecords: patient.medicalRecords || 0,
      upcomingAppointments: patient.nextAppointment ? 1 : 0,
      completedAppointments: patient.totalAppointments || 0,
    };
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        icon: CheckCircle,
      },
      inactive: {
        color: "text-slate-600 bg-slate-50 border-slate-200",
        icon: Clock,
      },
      pending: {
        color: "text-amber-600 bg-amber-50 border-amber-200",
        icon: Clock,
      },
      emergency: {
        color: "text-rose-600 bg-rose-50 border-rose-200",
        icon: AlertCircle,
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

  const getGenderBadge = (gender) => {
    const genderConfig = {
      male: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: User,
      },
      female: {
        color: "bg-pink-100 text-pink-800 border-pink-200",
        icon: User,
      },
      other: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: User,
      },
    };

    const config = genderConfig[gender] || genderConfig.other;
    const Icon = config.icon;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium ${config.color}`}
      >
        <Icon className="w-4 h-4" />
        <span className="capitalize">{gender}</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No appointment";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (err) {
      return "Invalid date";
    }
  };

  if (!isOpen || !patient) return null;

  const stats = getPatientStats(patient);
  const status = getPatientStatus(patient);
  const joinDate = getJoinDate(patient);

  return (
    <AnimatePresence>
      {isOpen && patient && (
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
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Patient Details
                  </h2>
                  <p className="text-slate-500 text-sm">
                    ID: #{patient._id?.slice(-6)}
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
              {/* Status & Gender */}
              <div className="flex items-center gap-3">
                {getStatusBadge(status)}
                {getGenderBadge(patient.gender)}
              </div>

              {/* Patient Basic Info with Picture */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {patient.patientPicture ? (
                      <img
                        src={patient.patientPicture}
                        alt={patient.name}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-cyan-600"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center border-2 border-cyan-600">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg mb-1">
                      {patient.name || "Unknown Patient"}
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-slate-700">
                          Age: {patient.age || "N/A"}
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
                    <Phone className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-700">
                        {patient.phone || "Not specified"}
                      </p>
                      <p className="text-sm text-slate-500">Phone</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-700">
                        {patient.email || "Not specified"}
                      </p>
                      <p className="text-sm text-slate-500">Email</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-700">
                        {patient.address || "Not specified"}
                      </p>
                      <p className="text-sm text-slate-500">Address</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              {patient.emergencyContact && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                    Emergency Contact
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl">
                      <User className="w-4 h-4 text-rose-500" />
                      <div>
                        <p className="font-medium text-slate-700">
                          {patient.emergencyContact.name || "Not specified"}
                        </p>
                        <p className="text-sm text-slate-500">Contact Person</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl">
                      <Phone className="w-4 h-4 text-rose-500" />
                      <div>
                        <p className="font-medium text-slate-700">
                          {patient.emergencyContact.phone || "Not specified"}
                        </p>
                        <p className="text-sm text-slate-500">
                          Emergency Phone
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl">
                      <Mail className="w-4 h-4 text-rose-500" />
                      <div>
                        <p className="font-medium text-slate-700">
                          {patient.emergencyContact.relationship ||
                            "Not specified"}
                        </p>
                        <p className="text-sm text-slate-500">Relationship</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Medical Statistics */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-500" />
                  Medical Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 text-center border border-cyan-200">
                    <Calendar className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-slate-800">
                      {stats.appointments}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      Total Appointments
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center border border-blue-200">
                    <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-slate-800">
                      {stats.medicalRecords}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      Medical Records
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 text-center border border-emerald-200">
                    <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-slate-800">
                      {stats.completedAppointments}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      Completed
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 text-center border border-amber-200">
                    <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-slate-800">
                      {stats.upcomingAppointments}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      Upcoming
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Information */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  Appointment Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-600">
                      Last Appointment
                    </span>
                    <span className="font-medium text-slate-800 text-sm">
                      {formatDate(patient.lastAppointment)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-600">
                      Next Appointment
                    </span>
                    <span
                      className={`font-medium text-sm ${
                        patient.nextAppointment
                          ? "text-cyan-600"
                          : "text-slate-500"
                      }`}
                    >
                      {formatDate(patient.nextAppointment)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-600">Patient ID</span>
                    <span className="font-medium text-slate-800 text-xs">
                      {patient._id?.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Patient
                </button>
                <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  Medical Records
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PatientDetailsSidebar;
