import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  X,
  Plus,
  Trash2,
  FileText,
  Pill,
  Stethoscope,
  ClipboardList,
  Loader2,
  Heart,
  Thermometer,
  Scale,
  Ruler,
} from "lucide-react";
import { toast } from "sonner";
import { createNotification } from "../../services/notificationService";
import { AppointmentContext } from "../../context/AppointmentContext";

const AddMedicalRecordModal = ({
  isOpen,
  onClose,
  patientId,
  clinicId,
  doctorId,
  appointmentId,
}) => {
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { fetchAppointments } = useContext(AppointmentContext);
  const [prescriptions, setPrescriptions] = useState([
    { medicine: "", dosage: "", duration: "", notes: "" },
  ]);

  // New state for vitals
  const [vitals, setVitals] = useState({
    bloodPressure: { systolic: "", diastolic: "" },
    heartRate: "",
    temperature: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    weight: "",
    height: "",
  });

  // New state for follow-up
  const [followUp, setFollowUp] = useState({
    required: false,
    date: "",
    notes: "",
  });

  const handlePrescriptionChange = (index, event) => {
    const values = [...prescriptions];
    values[index][event.target.name] = event.target.value;
    setPrescriptions(values);
  };

  const handleAddPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { medicine: "", dosage: "", duration: "", notes: "" },
    ]);
  };

  const handleRemovePrescription = (index) => {
    const values = [...prescriptions];
    values.splice(index, 1);
    setPrescriptions(values);
  };

  // Handle vitals changes
  const handleVitalsChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setVitals((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setVitals((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Handle follow-up changes
  const handleFollowUpChange = (field, value) => {
    setFollowUp((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/medical-records/add-records`,
        {
          patientId,
          clinicId,
          doctorId,
          appointmentId,
          chiefComplaint,
          vitals,
          diagnosis,
          treatment,
          notes,
          prescriptions,
          followUp: followUp.required ? followUp : undefined,
        }
      );

      if (patientId) {
        try {
          await createNotification({
            recipientId: patientId,
            recipientType: "Client",
            message: `Your medical record has been updated with diagnosis: ${diagnosis}`,
            type: "medical_record",
          });
        } catch (notificationError) {
          console.error("Failed to create notification:", notificationError);
          toast.error("Failed to create notification.");
        }
      }

      toast.success("Medical records was added successfully");
      fetchAppointments();
      onClose();
    } catch (error) {
      console.error("Error adding medical record:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200/50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl border border-cyan-200">
              <FileText className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                Add Medical Record
              </h2>
              <p className="text-slate-600 font-medium">
                Create a comprehensive medical record for this appointment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-700 transition-all duration-300 hover:scale-105"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Chief Complaint */}
          <div className="group">
            <label
              htmlFor="chiefComplaint"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3 tracking-wide uppercase"
            >
              <Stethoscope className="w-4 h-4 text-red-600" />
              Chief Complaint
            </label>
            <textarea
              id="chiefComplaint"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              rows="2"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-50/50 backdrop-blur-sm hover:border-slate-300 transition-all duration-300 text-slate-800 font-medium resize-none"
              placeholder="Enter patient's main complaint..."
              required
            ></textarea>
          </div>

          {/* Vitals Section */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4 tracking-wide uppercase">
              <Heart className="w-4 h-4 text-red-600" />
              Vital Signs
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Blood Pressure */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide">
                  Blood Pressure
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Systolic"
                    value={vitals.bloodPressure.systolic}
                    onChange={(e) =>
                      handleVitalsChange(
                        "bloodPressure.systolic",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
                  />
                  <span className="flex items-center text-slate-400">/</span>
                  <input
                    type="number"
                    placeholder="Diastolic"
                    value={vitals.bloodPressure.diastolic}
                    onChange={(e) =>
                      handleVitalsChange(
                        "bloodPressure.diastolic",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Heart Rate */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 72"
                  value={vitals.heartRate}
                  onChange={(e) =>
                    handleVitalsChange("heartRate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
                />
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">
                  <Thermometer className="w-3 h-3 inline mr-1" />
                  Temp (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 36.6"
                  value={vitals.temperature}
                  onChange={(e) =>
                    handleVitalsChange("temperature", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
                />
              </div>

              {/* Respiratory Rate */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">
                  Respiratory Rate
                </label>
                <input
                  type="number"
                  placeholder="e.g., 16"
                  value={vitals.respiratoryRate}
                  onChange={(e) =>
                    handleVitalsChange("respiratoryRate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
                />
              </div>

              {/* Oxygen Saturation */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">
                  SpO2 (%)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 98"
                  value={vitals.oxygenSaturation}
                  onChange={(e) =>
                    handleVitalsChange("oxygenSaturation", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
                />
              </div>

              {/* Weight and Height */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">
                    <Scale className="w-3 h-3 inline mr-1" />
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 70"
                    value={vitals.weight}
                    onChange={(e) =>
                      handleVitalsChange("weight", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">
                    <Ruler className="w-3 h-3 inline mr-1" />
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 175"
                    value={vitals.height}
                    onChange={(e) =>
                      handleVitalsChange("height", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="group">
            <label
              htmlFor="diagnosis"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3 tracking-wide uppercase"
            >
              <Stethoscope className="w-4 h-4 text-cyan-600" />
              Diagnosis
            </label>
            <input
              type="text"
              id="diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-50/50 backdrop-blur-sm hover:border-slate-300 transition-all duration-300 text-slate-800 font-medium"
              placeholder="Enter patient diagnosis..."
              required
            />
          </div>

          {/* Treatment */}
          <div className="group">
            <label
              htmlFor="treatment"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3 tracking-wide uppercase"
            >
              <ClipboardList className="w-4 h-4 text-emerald-600" />
              Treatment
            </label>
            <textarea
              id="treatment"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-50/50 backdrop-blur-sm hover:border-slate-300 transition-all duration-300 text-slate-800 font-medium resize-none"
              placeholder="Describe the treatment plan and procedures..."
              required
            ></textarea>
          </div>

          {/* Follow-up Section */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3 tracking-wide uppercase">
              <FileText className="w-4 h-4 text-orange-600" />
              Follow-up
            </label>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="followUpRequired"
                  checked={followUp.required}
                  onChange={(e) =>
                    handleFollowUpChange("required", e.target.checked)
                  }
                  className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                />
                <label
                  htmlFor="followUpRequired"
                  className="text-slate-700 font-medium"
                >
                  Schedule Follow-up Appointment
                </label>
              </div>

              {followUp.required && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={followUp.date}
                      onChange={(e) =>
                        handleFollowUpChange("date", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">
                      Follow-up Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Review test results"
                      value={followUp.notes}
                      onChange={(e) =>
                        handleFollowUpChange("notes", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="group">
            <label
              htmlFor="notes"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3 tracking-wide uppercase"
            >
              <FileText className="w-4 h-4 text-purple-600" />
              Additional Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-50/50 backdrop-blur-sm hover:border-slate-300 transition-all duration-300 text-slate-800 font-medium resize-none"
              placeholder="Any additional observations or notes..."
            ></textarea>
          </div>

          {/* Prescriptions */}
          <div className="group">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 tracking-wide uppercase">
                <Pill className="w-4 h-4 text-blue-600" />
                Prescriptions
              </label>
              <button
                type="button"
                onClick={handleAddPrescription}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-xl hover:from-blue-100 hover:to-blue-200 hover:shadow-md transition-all duration-300 border border-blue-200 font-semibold text-sm tracking-wide"
              >
                <Plus className="w-4 h-4" />
                Add Prescription
              </button>
            </div>

            <div className="space-y-4">
              {prescriptions.map((prescription, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">
                        Medicine
                      </label>
                      <input
                        type="text"
                        name="medicine"
                        placeholder="Medicine name"
                        value={prescription.medicine}
                        onChange={(e) => handlePrescriptionChange(index, e)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">
                        Dosage
                      </label>
                      <input
                        type="text"
                        name="dosage"
                        placeholder="e.g., 500mg"
                        value={prescription.dosage}
                        onChange={(e) => handlePrescriptionChange(index, e)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">
                        Duration
                      </label>
                      <input
                        type="text"
                        name="duration"
                        placeholder="e.g., 7 days"
                        value={prescription.duration}
                        onChange={(e) => handlePrescriptionChange(index, e)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">
                        Notes
                      </label>
                      <input
                        type="text"
                        name="notes"
                        placeholder="e.g., Take after meals"
                        value={prescription.notes}
                        onChange={(e) => handlePrescriptionChange(index, e)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
                      />
                    </div>
                  </div>
                  {prescriptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePrescription(index)}
                      className="flex items-center gap-2 px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 hover:shadow-md transition-all duration-300 font-semibold tracking-wide border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-xl hover:from-cyan-700 hover:to-cyan-800 hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold tracking-wide shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                </>
              ) : (
                "Add Medical Record"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicalRecordModal;
