import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Phone,
  Mail,
  Stethoscope,
  FileText,
  AlertTriangle,
  Pill,
  Activity,
  Heart,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";

const MedicalRecordDetailsSidebar = ({
  isOpen,
  onClose,
  record,
  onRecordDelete,
  onRecordUpdate,
}) => {
  if (!record) return null;

  const handleEdit = () => {
    toast.info("Edit feature coming soon");
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete medical record for ${record.patientId?.name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed && onRecordDelete) {
        onRecordDelete(record._id);
        onClose();
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && record && (
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
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Medical Record
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-140px)]">
              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Patient Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-slate-700">
                      {record.patientId?.name}
                    </p>
                    <p className="text-sm text-slate-500">Patient</p>
                  </div>
                  {record.patientId?.phone && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4" />
                      <span>{record.patientId.phone}</span>
                    </div>
                  )}
                  {record.patientId?.email && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-4 h-4" />
                      <span>{record.patientId.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Record Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  Record Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(record.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Stethoscope className="w-4 h-4" />
                    <span>{record.doctorId?.name}</span>
                  </div>
                  {record.type && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Activity className="w-4 h-4" />
                      <span className="capitalize">{record.type}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Diagnosis
                </h3>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-amber-800">{record.diagnosis}</p>
                </div>
              </div>

              {/* Treatment */}
              {record.treatment && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-purple-500" />
                    Treatment
                  </h3>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <p className="text-purple-800">{record.treatment}</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {record.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Additional Notes
                  </h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-slate-700">{record.notes}</p>
                  </div>
                </div>
              )}

              {/* Status */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Record Status
                </h3>
                <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-lg text-sm">
                  Reviewed
                </span>
              </div>
            </div>

            {/* Footer with Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200 bg-white">
              <div className="flex gap-3">
                <button
                  onClick={handleEdit}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Record
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MedicalRecordDetailsSidebar;
