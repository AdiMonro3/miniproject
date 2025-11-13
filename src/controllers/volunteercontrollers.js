import  asyncHandler  from "../utils/asyncHandler.js";
import  ApiResponse  from "../utils/ApiResponse.js";
import  ApiError  from "../utils/ApiError.js";
import User from "../models/user.model.js";
import VolunteerResponse from "../models/volunteerResponse.model.js";
import Request from "../models/helpRequest.model.js";

// ✅ GET volunteers nearby (within X km)
export const getNearbyVolunteers = asyncHandler(async (req, res) => {
    const { lat, long, radius = 10 } = req.query; // radius in km
  
    if (!lat || !long) throw new ApiError(400, "Latitude and longitude are required");
  
    const latitude = parseFloat(lat);
    const longitude = parseFloat(long);
    const radiusInMeters = parseFloat(radius) * 1000; // Mongo expects meters

  // ✅ GeoJSON query using $nearSphere
  const volunteers = await User.find({
    role: { $in: ["volunteer", "ngo"] },
    verified: true,
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: radiusInMeters
      }
    }
  }).select("name phone role location");
  
    return res
      .status(200)
      .json(new ApiResponse(200, "Nearby volunteers fetched successfully", { count: volunteers.length, volunteers }));
  });

  // ✅ POST: Volunteer responds to a help request
export const respondToRequest = asyncHandler(async (req, res) => {
    const { requestId, message } = req.body;
    const volunteerId = req.user.id; // from verifyToken middleware
  
    // Only volunteers and NGOs can respond
    if (!["volunteer", "ngo"].includes(req.user.role))
      throw new ApiError(403, "Only volunteers or NGOs can respond to requests");
  
    const request = await Request.findById(requestId);
    if (!request) throw new ApiError(404, "Help request not found");
  
    // prevent duplicate response from same volunteer
    const existingResponse = await VolunteerResponse.findOne({ requestId, volunteerId });
    if (existingResponse)
      throw new ApiError(400, "You have already responded to this request");
  
    const response = await VolunteerResponse.create({
      requestId,
      volunteerId,
      message,
      status: "interested"
    });
  
    return res
      .status(201)
      .json(new ApiResponse(201, "Response recorded successfully", response));
  });
  