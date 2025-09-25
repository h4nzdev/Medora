import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clinic",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true, // phone should be unique for login
  },
  email: {
    type: String,
    unique: true, // prevent duplicate emails
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    default: "Client",
  },
  password: {
    type: String,
    required: true, // will be hashed before save
  },
  patientPicture: {
    type: String, // URL to the patient's profile picture
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // ✅ Emergency Contact
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    relationship: { type: String }, // e.g., Mom, Dad, Friend
  },
});

const Patient = mongoose.model("Patient", PatientSchema, "patients");

export default Patient;
