import mongoose from "mongoose";

const emergencyLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["medical", "disaster", "accident", "violence", "other"],
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    status: {
      type: String,
      enum: ["open", "resolved"],
      default: "open",
    },

    responders_notified: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // volunteers/NGOs notified
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: false } } // only need createdAt
);

// Geospatial index for location-based queries
emergencyLogSchema.index({ location: "2dsphere" });

const EmergencyLog = mongoose.model("EmergencyLog", emergencyLogSchema);
export default EmergencyLog;
