import mongoose from "mongoose";

const MedicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clinic",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
  },

  chiefComplaint: {
    type: String,
    required: true,
  },
  vitals: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
    },
    heartRate: Number,
    temperature: Number,
    respiratoryRate: Number,
    oxygenSaturation: Number,
    weight: Number, // in kg
    height: Number, // in cm
  },

  diagnosis: {
    type: String,
    required: true,
  },
  treatment: {
    type: String,
  },
  notes: {
    type: String,
  },
  prescriptions: [
    {
      medicine: String,
      dosage: String,
      duration: String,
      notes: String, // e.g., "Take after meals"
    },
  ],

  followUp: {
    required: Boolean,
    date: Date,
    notes: String, // e.g., "Review blood test results"
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MedicalRecord = mongoose.model(
  "MedicalRecord",
  MedicalRecordSchema,
  "medical_records"
);

export default MedicalRecord;
