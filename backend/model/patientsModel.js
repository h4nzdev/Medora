import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
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
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      default: "Client",
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },
    password: {
      type: String,
      required: true,
    },
    patientPicture: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      email: { type: String },
      relationship: { type: String },
    },
  },
  {
    // ADD THIS PART TO REMOVE PASSWORD FROM RESPONSES
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password; // This removes password from ALL API responses
        delete ret.__v; // Also remove version key
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Patient = mongoose.model("Patient", PatientSchema, "patients");
export default Patient;
