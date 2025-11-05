import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  // Who sent it (optional)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },

  userType: {
    type: String,
    enum: ["Client", "Clinic", null],
    default: null,
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

  // Admin response to the feedback
  adminResponse: {
    message: {
      type: String,
      required: false,
    },
    respondedAt: {
      type: Date,
      required: false,
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },
  },

  // Admin reactions
  adminReaction: {
    type: String,
    enum: ["thumbs_up", "thumbs_down", null],
    default: null,
  },

  // When admin reacted
  reactedAt: {
    type: Date,
    required: false,
  },

  // Who reacted (admin)
  reactedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: false,
  },

  // Status tracking
  status: {
    type: String,
    enum: ["pending", "reviewed", "resolved", "closed"],
    default: "pending",
  },
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);
export default Feedback;
