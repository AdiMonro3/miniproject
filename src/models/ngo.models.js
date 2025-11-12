import mongoose from "mongoose";

const ngoSchema = new mongoose.Schema(
  {
    // Link each NGO to a user account (the NGO admin)
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // each NGO has one admin user
    },

    ngo_name: {
      type: String,
      required: true,
      trim: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    contact: {
      type: String,
      required: true,
      trim: true,
    },

    area_of_operation: {
      type: String,
      required: true, // e.g., "Delhi NCR", "Uttar Pradesh", "Pan India"
    },

    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const NGO = mongoose.model("NGO", ngoSchema);
export default NGO;
