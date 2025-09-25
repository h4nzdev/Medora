import mongoose from "mongoose";

const ClinicSchema = new mongoose.Schema({
  clinicName: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  email: {
    type: String, // clinic login email
    required: true,
    unique: true,
  },
  password: {
    type: String, // hashed password
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  clinicPicture: {
    type: String, 
    required: false,
  },
  agreeToTerms: {
    type: Boolean,
    default: false,
  },
  subscriptionPlan: {
    type: String,
    enum: ["free", "basic", "pro"], // added "Free" for your form
    default: "free",
  },
  dailyPatientLimit: {
    type: Number,
    default: 20, // Free/Basic = 20; Premium = 50
  },
  currentPatientCount: {
    type: Number,
    default: 0, // resets each day
  },
  role: {
    type: String,
    default: "Clinic",
  },
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Clinic = mongoose.model("Clinic", ClinicSchema, "clinics");

export default Clinic;
