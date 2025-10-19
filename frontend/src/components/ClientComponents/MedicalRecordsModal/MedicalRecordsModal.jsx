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

  console.log(record);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out hide-scroll">
        <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white p-6 rounded-t-2xl z-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Medical Record Details</h2>
              <p className="text-cyan-100 text-sm mt-1">
                Comprehensive patient information
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200 p-2 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {record && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg hover:border-cyan-300 transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-600 rounded-lg">
                    <FileText size={16} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-700 text-sm">
                    Appointment ID
                  </p>
                </div>
                <p className="text-gray-900 font-mono text-sm">
                  {record.appointmentId?._id}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg hover:border-cyan-300 transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-600 rounded-lg">
                    <Calendar size={16} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-700 text-sm">
                    Appointment Date
                  </p>
                </div>
                <p className="text-gray-900">
                  {new Date(record.appointmentId?.date).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg hover:border-cyan-300 transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-600 rounded-lg">
                    <Clock size={16} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-700 text-sm">Status</p>
                </div>
                <p className="text-gray-900 capitalize">
                  {record.appointmentId?.status}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg hover:border-cyan-300 transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-600 rounded-lg">
                    <Building2 size={16} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-700 text-sm">Clinic</p>
                </div>
                <p className="text-gray-900">{record.clinicId?.clinicName}</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg hover:border-cyan-300 transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-600 rounded-lg">
                    <Stethoscope size={16} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-700 text-sm">Doctor</p>
                </div>
                <p className="text-gray-900">{record.doctorId?.name}</p>
                <p className="text-cyan-600 text-sm">
                  {record.doctorId?.specialty}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg hover:border-cyan-300 transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-600 rounded-lg">
                    <Calendar size={16} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-700 text-sm">
                    Date Recorded
                  </p>
                </div>
                <p className="text-gray-900">
                  {new Date(record.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <div className="w-1 h-6 bg-cyan-600 rounded"></div>
                Medical Information
              </h3>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-cyan-300 transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-cyan-600 rounded-lg">
                    <FileText size={18} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-800">Diagnosis</p>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {record.diagnosis}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-cyan-300 transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-cyan-600 rounded-lg">
                    <Stethoscope size={18} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-800">Treatment</p>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {record.treatment}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-cyan-300 transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-cyan-600 rounded-lg">
                    <FileText size={18} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-800">Notes</p>
                </div>
                <p className="text-gray-700 leading-relaxed">{record.notes}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-600 rounded-lg">
                  <Pill size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Prescriptions
                </h3>
              </div>
              <div className="space-y-3">
                {record.prescriptions.map((p, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 border border-gray-200 p-4 rounded-lg hover:border-cyan-300 transition-all duration-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">
                          Medication
                        </p>
                        <p className="font-semibold text-gray-900">
                          {p.medicine}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">
                          Dosage
                        </p>
                        <p className="text-gray-900">{p.dosage}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">
                          Instructions
                        </p>
                        <p className="text-gray-700">{p.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 rounded-b-2xl">
          <div className="flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all duration-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordsModal;
