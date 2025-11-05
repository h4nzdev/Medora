import mongoose from "mongoose";

const SystemUpdateSchema = new mongoose.Schema(
  {
    // Update title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Detailed description
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Update status
    status: {
      type: String,
      enum: ["draft", "scheduled", "published", "archived"],
      default: "draft",
    },

    // Priority level
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // Who created the update (admin)
    createdBy: {
      type: String,
      required: true,
      default: "Admin",
    },

    // When it was created
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // When it was published (if applicable)
    publishedAt: {
      type: Date,
      required: false,
    },

    // When it's scheduled for (if scheduled)
    scheduledFor: {
      type: Date,
      required: false,
    },

    // Tags for categorization
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // Read count tracking
    readCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const SystemUpdate = mongoose.model(
  "SystemUpdate",
  SystemUpdateSchema,
  "system-updates"
);
export default SystemUpdate;
