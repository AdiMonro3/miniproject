import mongoose from "mongoose";

const requestSchema =new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // foreign key to User collection
        required: true,
      },
  
      category: {
        type: String,
        enum: ["food", "medical", "transport", "shelter", "other"],
        required: true,
      },
  
      description: {
        type: String,
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
        }
      },
  
      status: {
        type: String,
        enum: ["open", "in_progress", "completed", "cancelled"],
        default: "open",
      },
  
      assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // volunteer or NGO who accepted
        default: null,
      },
  
      urgency: {
        type: String,
        enum: ["low", "medium", "high", "emergency"],
        default: "medium",
      }
},{timestamps:true});

// Create geospatial index for fast nearby request queries
requestSchema.index({ location: "2dsphere" });

const Request = mongoose.model("Request", requestSchema);

export default Request;