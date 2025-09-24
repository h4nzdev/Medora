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
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-200/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-cyan-100/20 hide-scroll">
        <div className="sticky top-0 bg-cyan-500 text-white p-6 rounded-t-xl border-b border-slate-600/20 z-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Medical Record Details
              </h2>
              <p className="text-slate-200 text-sm mt-1 font-medium">
                Comprehensive patient information
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 p-2 rounded-full hover:scale-110"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {record && (
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/50 p-5 rounded-xl hover:shadow-md hover:scale-105 hover:border-slate-300/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-600 rounded-lg">
                    <FileText size={16} className="text-white" />
                  </div>
                  <p className="font-semibold text-slate-700 tracking-wide">
                    Appointment ID
                  </p>
                </div>
                <p className="text-slate-800 font-mono text-sm">
                  {record.appointmentId?._id}
                </p>
              </div>

              <div className="bg-cyan-50/80 backdrop-blur-sm border border-cyan-200/50 p-5 rounded-xl hover:shadow-md hover:scale-105 hover:border-cyan-300/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-600 rounded-lg">
                    <Calendar size={16} className="text-white" />
                  </div>
                  <p className="font-semibold text-cyan-700 tracking-wide">
                    Appointment Date
                  </p>
                </div>
                <p className="text-slate-800 font-medium">
                  {new Date(record.appointmentId?.date).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-purple-50/80 backdrop-blur-sm border border-purple-200/50 p-5 rounded-xl hover:shadow-md hover:scale-105 hover:border-purple-300/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Clock size={16} className="text-white" />
                  </div>
                  <p className="font-semibold text-purple-700 tracking-wide">
                    Status
                  </p>
                </div>
                <p className="text-slate-800 font-medium capitalize">
                  {record.appointmentId?.status}
                </p>
              </div>

              <div className="bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/50 p-5 rounded-xl hover:shadow-md hover:scale-105 hover:border-emerald-300/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-600 rounded-lg">
                    <Building2 size={16} className="text-white" />
                  </div>
                  <p className="font-semibold text-emerald-700 tracking-wide">
                    Clinic
                  </p>
                </div>
                <p className="text-slate-800 font-medium">
                  {record.clinicId?.clinicName}
                </p>
              </div>

              <div className="bg-cyan-50/80 backdrop-blur-sm border border-cyan-200/50 p-5 rounded-xl hover:shadow-md hover:scale-105 hover:border-cyan-300/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-600 rounded-lg">
                    <Stethoscope size={16} className="text-white" />
                  </div>
                  <p className="font-semibold text-cyan-700 tracking-wide">
                    Doctor
                  </p>
                </div>
                <p className="text-slate-800 font-medium">
                  {record.doctorId?.name}
                </p>
                <p className="text-cyan-600 text-sm font-medium">
                  ({record.doctorId?.specialty})
                </p>
              </div>

              <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/50 p-5 rounded-xl hover:shadow-md hover:scale-105 hover:border-slate-300/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-slate-600 rounded-lg">
                    <Calendar size={16} className="text-white" />
                  </div>
                  <p className="font-semibold text-slate-700 tracking-wide">
                    Date Recorded
                  </p>
                </div>
                <p className="text-slate-800 font-medium">
                  {new Date(record.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="my-6 h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200"></div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                Medical Information
              </h3>

              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-slate-600 rounded-lg">
                    <FileText size={18} className="text-white" />
                  </div>
                  <p className="font-bold text-slate-800 text-lg tracking-tight">
                    Diagnosis
                  </p>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {record.diagnosis}
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-cyan-600 rounded-lg">
                    <Stethoscope size={18} className="text-white" />
                  </div>
                  <p className="font-bold text-slate-800 text-lg tracking-tight">
                    Treatment
                  </p>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {record.treatment}
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-emerald-600 rounded-lg">
                    <FileText size={18} className="text-white" />
                  </div>
                  <p className="font-bold text-slate-800 text-lg tracking-tight">
                    Notes
                  </p>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {record.notes}
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-600 rounded-lg">
                  <Pill size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                  Prescriptions
                </h3>
              </div>
              <div className="space-y-4">
                {record.prescriptions.map((p, i) => (
                  <div
                    key={i}
                    className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/50 p-4 rounded-xl shadow-sm hover:shadow-md hover:scale-105 hover:border-slate-300/50 transition-all duration-300"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-600 mb-1 tracking-wide uppercase">
                          Medication
                        </p>
                        <p className="font-bold text-slate-800">{p.medicine}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-600 mb-1 tracking-wide uppercase">
                          Dosage
                        </p>
                        <p className="font-medium text-slate-700">{p.dosage}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-600 mb-1 tracking-wide uppercase">
                          Instructions
                        </p>
                        <p className="text-slate-600 font-medium">
                          {p.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="sticky bottom-0 bg-slate-50/90 backdrop-blur-sm border-t border-slate-200/50 p-6 rounded-b-xl">
          <div className="flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-center px-8 py-3 bg-cyan-600/90 backdrop-blur-sm text-white rounded-xl shadow-lg hover:bg-cyan-700 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-cyan-500/20"
            >
              <span className="font-semibold tracking-wide">Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordsModal;
