"use client";

/* eslint-disable react/prop-types */
import {
  X,
  Calendar,
  Building2,
  Stethoscope,
  FileText,
  Pill,
  Clock,
} from "lucide-react";

const MedicalRecordsModal = ({ isOpen, setIsOpen, record }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Medical Record
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Patient medical information
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        {record && (
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Basic Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Appointment ID
                </p>
                <p className="text-sm font-mono text-gray-900 truncate">
                  {record.appointmentId?._id}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Date
                </p>
                <p className="text-sm text-gray-900">
                  {new Date(record.appointmentId?.date).toLocaleDateString()}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Status
                </p>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    record.appointmentId?.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : record.appointmentId?.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {record.appointmentId?.status}
                </span>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Clinic
                </p>
                <p className="text-sm text-gray-900">
                  {record.clinicId?.clinicName}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Doctor
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {record.doctorId?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {record.doctorId?.specialty}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Recorded
                </p>
                <p className="text-sm text-gray-900">
                  {new Date(record.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Medical Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Diagnosis
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 leading-relaxed">
                      {record.diagnosis}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Treatment
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 leading-relaxed">
                      {record.treatment}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Notes
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 leading-relaxed">
                      {record.notes}
                    </p>
                  </div>
                </div>
              </div>

              {/* Prescriptions */}
              {record.prescriptions && record.prescriptions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3 border-b border-gray-200 pb-2">
                    Prescriptions
                  </h4>
                  <div className="space-y-3">
                    {record.prescriptions.map((prescription, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                              Medication
                            </p>
                            <p className="font-medium text-gray-900">
                              {prescription.medicine}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                              Dosage
                            </p>
                            <p className="text-gray-900">
                              {prescription.dosage}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                              Duration
                            </p>
                            <p className="text-gray-900">
                              {prescription.duration}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordsModal;
