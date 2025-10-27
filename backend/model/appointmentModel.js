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
  // Add these new fields for better tracking
  cancellationReason: {
    type: String,
  },
  autoCancelled: {
    type: Boolean,
    default: false,
  },
});

// Add the static method here
AppointmentSchema.statics.cancelExpiredAppointments = async function () {
  const now = new Date();

  const result = await this.updateMany(
    {
      status: { $in: ["pending", "accepted", "scheduled"] }, // Include 'accepted' status
      date: { $lt: now }, // Appointment date is in the past
    },
    {
      status: "cancelled",
      cancellationReason: "Automatically cancelled - appointment date passed",
      autoCancelled: true,
    }
  );

  return result;
};

// Optional: Add an instance method to check if appointment is expired
AppointmentSchema.methods.isExpired = function () {
  const appointmentDate = new Date(this.date);
  const now = new Date();
  return (
    now > appointmentDate &&
    ["pending", "accepted", "scheduled"].includes(this.status)
  );
};

const Appointment = mongoose.model(
  "Appointment",
  AppointmentSchema,
  "appointments"
);

export default Appointment;
