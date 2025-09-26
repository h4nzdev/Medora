import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
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
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "rejected",
      "scheduled",
      "completed",
      "cancelled",
    ],
    default: "pending",
  },
  type: {
    type: String, // reason for visit (e.g., "check-up", "follow-up")
  },
  bookingType: {
    type: String,
    enum: ["online", "walk-in"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Appointment = mongoose.model(
  "Appointment",
  AppointmentSchema,
  "appointments"
);

export default Appointment;
