"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  Building2,
  Stethoscope,
  FileText,
  Pill,
  Clock,
  User,
  Heart,
  Thermometer,
  Ruler,
  Scale,
  Download,
} from "lucide-react";
import { formatDate } from "../../../../utils/date";
import jsPDF from "jspdf";

const ClientMedicalRecordDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRecord = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/medical-records/${id}`
      );
      setRecord(res.data);
    } catch (error) {
      console.error("Error fetching record:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRecord();
    }
  }, [id]);

  const handleDownload = () => {
    if (!record) return;

    const doc = new jsPDF();
    let yPos = 10;

    doc.setFontSize(18);
    doc.text("Medical Record Details", 10, yPos);
    yPos += 15;

    // Basic Information
    doc.setFontSize(12);
    doc.text(`Appointment ID: ${record.appointmentId?._id || "N/A"}`, 10, yPos);
    yPos += 7;
    doc.text(
      `Appointment Date: ${formatDate(record.appointmentId?.date)}`,
      10,
      yPos
    );
    yPos += 7;
    doc.text(`Clinic: ${record.clinicId?.clinicName || "N/A"}`, 10, yPos);
    yPos += 7;
    doc.text(`Doctor: ${record.doctorId?.name || "N/A"}`, 10, yPos);
    yPos += 7;
    doc.text(`Specialty: ${record.doctorId?.specialty || "N/A"}`, 10, yPos);
    yPos += 10;

    // Medical Information
    doc.setFontSize(14);
    doc.text("Medical Information", 10, yPos);
    yPos += 10;

    doc.setFontSize(12);
    if (record.chiefComplaint) {
      doc.text(`Chief Complaint: ${record.chiefComplaint}`, 10, yPos);
      yPos += 7;
    }

    if (record.vitals) {
      doc.text("Vital Signs:", 10, yPos);
      yPos += 7;
      if (record.vitals.bloodPressure?.systolic) {
        doc.text(
          `  Blood Pressure: ${record.vitals.bloodPressure.systolic}/${record.vitals.bloodPressure.diastolic} mmHg`,
          15,
          yPos
        );
        yPos += 7;
      }
      if (record.vitals.heartRate) {
        doc.text(`  Heart Rate: ${record.vitals.heartRate} bpm`, 15, yPos);
        yPos += 7;
      }
      if (record.vitals.temperature) {
        doc.text(`  Temperature: ${record.vitals.temperature} °C`, 15, yPos);
        yPos += 7;
      }
      if (record.vitals.weight) {
        doc.text(`  Weight: ${record.vitals.weight} kg`, 15, yPos);
        yPos += 7;
      }
      if (record.vitals.height) {
        doc.text(`  Height: ${record.vitals.height} cm`, 15, yPos);
        yPos += 7;
      }
    }

    doc.text(`Diagnosis: ${record.diagnosis}`, 10, yPos);
    yPos += 7;

    if (record.treatment) {
      doc.text(`Treatment: ${record.treatment}`, 10, yPos);
      yPos += 7;
    }

    if (record.notes) {
      doc.text(`Notes: ${record.notes}`, 10, yPos);
      yPos += 7;
    }

    // Prescriptions
    if (record.prescriptions && record.prescriptions.length > 0) {
      yPos += 5;
      doc.setFontSize(14);
      doc.text("Prescriptions", 10, yPos);
      yPos += 10;

      doc.setFontSize(12);
      record.prescriptions.forEach((prescription, index) => {
        doc.text(`${index + 1}. ${prescription.medicine}`, 10, yPos);
        yPos += 7;
        doc.text(`   Dosage: ${prescription.dosage}`, 15, yPos);
        yPos += 7;
        doc.text(`   Duration: ${prescription.duration}`, 15, yPos);
        yPos += 7;
        if (prescription.notes) {
          doc.text(`   Notes: ${prescription.notes}`, 15, yPos);
          yPos += 7;
        }
        yPos += 3;
      });
    }

    doc.save(`medical-record-${record._id}.pdf`);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading medical record...</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 w-fit mx-auto mb-6">
            <FileText className="w-16 h-16 text-slate-400 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">
            Record Not Found
          </h3>
          <p className="text-slate-500 mb-4">
            The requested medical record could not be found.
          </p>
          <button
            onClick={() => navigate("/client/medical-records")}
            className="px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors"
          >
            Back to Records
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30 pb-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-slate-800">
                  Medical Record Details
                </h1>
                <p className="text-slate-600 mt-1">
                  Comprehensive patient information
                </p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="flex w-full md:max-w-54 justify-center md:mt-0 mt-4 items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-semibold"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Medical Record Details</h2>
                <p className="text-cyan-100 text-sm mt-1">
                  Comprehensive patient information
                </p>
              </div>
            </div>
          </div>

          {record && (
            <div className="p-6 space-y-6">
              {/* Basic Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg hover:border-cyan-300 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-cyan-600 p-2 rounded-lg">
                      <FileText size={16} className="text-white" />
                    </div>
                    <p className="font-semibold text-slate-700 text-sm">
                      Appointment ID
                    </p>
                  </div>
                  <p className="text-slate-900 font-mono text-sm">
                    {record.appointmentId?._id || "N/A"}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg hover:border-cyan-300 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-cyan-600 p-2 rounded-lg">
                      <Calendar size={16} className="text-white" />
                    </div>
                    <p className="font-semibold text-slate-700 text-sm">
                      Appointment Date
                    </p>
                  </div>
                  <p className="text-slate-900">
                    {formatDate(record.appointmentId?.date)}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg hover:border-cyan-300 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-cyan-600 p-2 rounded-lg">
                      <Clock size={16} className="text-white" />
                    </div>
                    <p className="font-semibold text-slate-700 text-sm">
                      Status
                    </p>
                  </div>
                  <p className="text-slate-900 capitalize">
                    {record.appointmentId?.status || "N/A"}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg hover:border-cyan-300 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-cyan-600 p-2 rounded-lg">
                      <Building2 size={16} className="text-white" />
                    </div>
                    <p className="font-semibold text-slate-700 text-sm">
                      Clinic
                    </p>
                  </div>
                  <p className="text-slate-900">
                    {record.clinicId?.clinicName || "N/A"}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg hover:border-cyan-300 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-cyan-600 p-2 rounded-lg">
                      <Stethoscope size={16} className="text-white" />
                    </div>
                    <p className="font-semibold text-slate-700 text-sm">
                      Doctor
                    </p>
                  </div>
                  <p className="text-slate-900">
                    {record.doctorId?.name || "N/A"}
                  </p>
                  <p className="text-cyan-600 text-sm">
                    {record.doctorId?.specialty || "N/A"}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg hover:border-cyan-300 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-cyan-600 p-2 rounded-lg">
                      <Calendar size={16} className="text-white" />
                    </div>
                    <p className="font-semibold text-slate-700 text-sm">
                      Date Recorded
                    </p>
                  </div>
                  <p className="text-slate-900">
                    {formatDate(record.createdAt)}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 my-6"></div>

              {/* Medical Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <div className="w-1 h-6 bg-cyan-600 rounded"></div>
                  Medical Information
                </h3>

                {/* Chief Complaint */}
                {record.chiefComplaint && (
                  <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-cyan-300 transition-all duration-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-cyan-600 p-2 rounded-lg">
                        <User size={18} className="text-white" />
                      </div>
                      <p className="font-semibold text-slate-800">
                        Chief Complaint
                      </p>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {record.chiefComplaint}
                    </p>
                  </div>
                )}

                {/* Vital Signs */}
                {record.vitals && (
                  <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-cyan-300 transition-all duration-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-cyan-600 p-2 rounded-lg">
                        <Heart size={18} className="text-white" />
                      </div>
                      <p className="font-semibold text-slate-800">
                        Vital Signs
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {record.vitals.bloodPressure?.systolic && (
                        <div>
                          <p className="text-sm text-slate-600">
                            Blood Pressure
                          </p>
                          <p className="font-semibold text-slate-800">
                            {record.vitals.bloodPressure.systolic}/
                            {record.vitals.bloodPressure.diastolic} mmHg
                          </p>
                        </div>
                      )}
                      {record.vitals.heartRate && (
                        <div>
                          <p className="text-sm text-slate-600">Heart Rate</p>
                          <p className="font-semibold text-slate-800">
                            {record.vitals.heartRate} bpm
                          </p>
                        </div>
                      )}
                      {record.vitals.temperature && (
                        <div>
                          <p className="text-sm text-slate-600">Temperature</p>
                          <p className="font-semibold text-slate-800">
                            {record.vitals.temperature} °C
                          </p>
                        </div>
                      )}
                      {record.vitals.weight && (
                        <div>
                          <p className="text-sm text-slate-600">Weight</p>
                          <p className="font-semibold text-slate-800">
                            {record.vitals.weight} kg
                          </p>
                        </div>
                      )}
                      {record.vitals.height && (
                        <div>
                          <p className="text-sm text-slate-600">Height</p>
                          <p className="font-semibold text-slate-800">
                            {record.vitals.height} cm
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Diagnosis */}
                <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-cyan-300 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-cyan-600 p-2 rounded-lg">
                      <FileText size={18} className="text-white" />
                    </div>
                    <p className="font-semibold text-slate-800">Diagnosis</p>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {record.diagnosis}
                  </p>
                </div>

                {/* Treatment */}
                {record.treatment && (
                  <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-cyan-300 transition-all duration-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-cyan-600 p-2 rounded-lg">
                        <Stethoscope size={18} className="text-white" />
                      </div>
                      <p className="font-semibold text-slate-800">Treatment</p>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {record.treatment}
                    </p>
                  </div>
                )}

                {/* Notes */}
                {record.notes && (
                  <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-cyan-300 transition-all duration-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-cyan-600 p-2 rounded-lg">
                        <FileText size={18} className="text-white" />
                      </div>
                      <p className="font-semibold text-slate-800">Notes</p>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {record.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Prescriptions */}
              {record.prescriptions && record.prescriptions.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-cyan-600 p-2 rounded-lg">
                      <Pill size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Prescriptions
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {record.prescriptions.map((p, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 border border-slate-200 p-4 rounded-lg hover:border-cyan-300 transition-all duration-200"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-1 uppercase">
                              Medication
                            </p>
                            <p className="font-semibold text-slate-900">
                              {p.medicine}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-1 uppercase">
                              Dosage
                            </p>
                            <p className="text-slate-900">{p.dosage}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-1 uppercase">
                              Duration
                            </p>
                            <p className="text-slate-700">{p.duration}</p>
                          </div>
                          {p.notes && (
                            <div>
                              <p className="text-xs font-semibold text-slate-500 mb-1 uppercase">
                                Notes
                              </p>
                              <p className="text-slate-700">{p.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up Information */}
              {record.followUp && (
                <div className="bg-white border border-slate-200 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-cyan-600 p-2 rounded-lg">
                      <Calendar size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Follow-up Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">
                        Follow-up Date
                      </p>
                      <p className="text-slate-800">
                        {formatDate(record.followUp.date)}
                      </p>
                    </div>
                    {record.followUp.notes && (
                      <div>
                        <p className="text-sm font-semibold text-slate-600 mb-1">
                          Follow-up Notes
                        </p>
                        <p className="text-slate-800">
                          {record.followUp.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-200 p-4">
            <div className="flex justify-end">
              <button
                onClick={() => navigate("/client/medical-records")}
                className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all duration-200 font-medium"
              >
                Back to Records
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientMedicalRecordDetails;
