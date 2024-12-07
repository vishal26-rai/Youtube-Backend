import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
   // Get user details from frontend
   //validation - not empty
   // check if user is already exist: username , email
   // check for images,check for avatar
   // upload them to cloudinary, avatar
   // create user object - create entry in DB
   // remove password and refresh token field from response
   // check for user creation
   // return response

   // Get user details from frontend

   const {username, email, fullname, password} = req.body
//    console.log("email:",email);

   //validation - not empty
   if(
    [fullname, username, password, email].some((field)=>
    field?.trim() === "")
   ){
    throw new ApiError (400, "All fields are required" )
   }

   // check if user is already exist: username , email
   const existingUser = await User.findOne({$or: [{username}, {email}]})

   if(existingUser){
    throw new ApiError(409, "User already exist")
   }
   console.log(req.files);
   

   // check for images,check for avatar
   const avatarLocalPath = req.files?.avatar[0]?.path; 
//    const coverImageLocalPath =  req.files?.coverImage[0]?.path; here we are doing standard JS approch 

// Now we are using simple approch to check
let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path
}

   if(!avatarLocalPath){
    throw new ApiError(400, "Avatar File is required");
   }

    // upload them to cloudinary, avatar

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar File is required")
    }

    // create user object - create entry in DB
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password,
        email,
        username: username
    })

    // remove password and refresh token field from Response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation
    if(!createdUser){
        throw new ApiError(500, "Something went Wrong while Registering the User ☹️")
    }

    // return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully ")
    )
})

export {registerUser} 