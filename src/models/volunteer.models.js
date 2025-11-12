import mongoose from "mongoose";

const volunteerResponseSchema = new mongoose.Schema(
  {
    request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request", // Link to HelpRequest
      required: true,
    },

    volunteer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Link to volunteer or NGO
      required: true,
    },

    status: {
      type: String,
      enum: ["interested", "accepted", "rejected", "completed"],
      default: "interested",
    },

    message: {
      type: String,
      default: "",
    },

    responded_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // adds createdAt, updatedAt automatically
);

// Prevent duplicate response records from the same volunteer for the same request
volunteerResponseSchema.index({ request_id: 1, volunteer_id: 1 }, { unique: true });

const VolunteerResponse = mongoose.model("VolunteerResponse", volunteerResponseSchema);
export default VolunteerResponse;
