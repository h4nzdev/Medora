import mongoose from "mongoose";

const ClinicSchema = new mongoose.Schema(
  {
    clinicName: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
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

const Clinic = mongoose.model("Clinic", ClinicSchema, "clinics");
export default Clinic;
