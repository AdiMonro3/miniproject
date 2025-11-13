import HelpRequest from "../models/helpRequest.model.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/ApiError.utils.js";
import ApiResponse from "../utils/Apirespnse.utils.js";

// ✅ CREATE Help Request (for users)
const createRequest=asyncHandler(async (req,res)=>{
    const {category,description,location,urgency}=req.body;

    if([category,description,location,urgency].some((fiels)=> fiels?.trim==="")){
        throw new ApiError(400, "All fields are required")
    }
    const newRequest=await Request.create({
        userId: req.user.id,
        category,
        description,
        location,
        urgency
    })

    return res.status(201).json(
        new ApiResponse(200, newRequest, "New Request Created Successfully")
    )
});

// ✅ LIST Nearby Requests (for volunteers / NGOs)
export const listNearbyRequests = asyncHandler(async (req, res) => {

    const { lat, long, radius = 10 } = req.query; // radius in km

    if (!lat || !long)
      return res.status(400).json({ message: "Latitude and longitude are required" });

    // Approximate geo filter (no GeoJSON)
    const R = 6371; // Earth's radius in km
    const maxLat = parseFloat(lat) + (radius / R) * (180 / Math.PI);
    const minLat = parseFloat(lat) - (radius / R) * (180 / Math.PI);
    const maxLong = parseFloat(long) + (radius / R) * (180 / Math.PI) / Math.cos(parseFloat(lat) * Math.PI / 180);
    const minLong = parseFloat(long) - (radius / R) * (180 / Math.PI) / Math.cos(parseFloat(lat) * Math.PI / 180);

    const requests = await HelpRequest.find({
        location: {
            $nearSphere: {
              $geometry: { type: "Point", coordinates: [ userLong, userLat ] },
              $maxDistance: radiusInMeters
            }
          },
          status: "open"
        }).populate("userId", "name phone");

    res.status(200).json({ count: requests.length, requests });
 
});

// ✅ GET Request Details (by ID)
const getRequestById = asyncHandler(async (req, res, next) => {
    const request = await HelpRequest.findById(req.params.id)
      .populate("userId", "name phone")
      .populate("assignedTo", "name role");
  
    if (!request) throw new ApiError(404, "Request not found");
  
    return res
      .status(200)
      .json(new ApiResponse(200, "Request fetched successfully", request));
  });

// ✅ UPDATE Request Status (admin/volunteer/NGO)
const updateRequestStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status, assignedTo } = req.body;
  
    const request = await HelpRequest.findById(id);
    if (!request) throw new ApiError(404, "Request not found");
  
    // Only admin, volunteer, or NGO can update
    if (!["admin", "volunteer", "ngo"].includes(req.user.role))
      throw new ApiError(403, "Permission denied");
  
    if (assignedTo) {
      const volunteer = await User.findById(assignedTo);
      if (!volunteer) throw new ApiError(404, "Volunteer not found");
      request.assignedTo = assignedTo;
    }
  
    if (status) request.status = status;
    request.updatedAt = Date.now();
  
    await request.save();
  
    return res
      .status(200)
      .json(new ApiResponse(200, "Status updated successfully", request));
  });