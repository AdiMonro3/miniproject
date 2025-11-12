import ApiError from "../utils/ApiError.utils.js";
import ApiResponse from "../utils/Apirespnse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

const register=asyncHandler(async (req,res)=>{
    const {name, email, phone, password } = req.body;

    if ([name, email, phone, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ phone }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    
})