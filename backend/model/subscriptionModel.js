// models/Subscription.js
import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clinic",
    required: true,
  },
  plan: {
    type: String,
    enum: ["free", "basic", "pro"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "expired", "cancelled"],
    default: "active",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Subscription = mongoose.model(
  "Subscriptions",
  SubscriptionSchema,
  "subscriptions"
);

export default Subscription;
