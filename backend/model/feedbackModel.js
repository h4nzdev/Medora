import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  // Who sent it (optional)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: false,
  },

  // What they want to tell you
  message: {
    type: String,
    required: true,
  },

  // How they feel about it
  type: {
    type: String,
    enum: ["bug", "suggestion", "complaint", "compliment"],
    default: "suggestion",
  },

  // When they sent it
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);
export default Feedback;
