import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req,res)=>{
     //   get the user detail from the frontend
     //   validation - not empty 
     //   check if user already exists :username ,email
     //   check for images , check for avatar
     //   upload them to cloudinary , check avatar
     //   create user Object - create entry in db 
     //   remove password and refresh token field from response 
     //   check for user creation
     //   return res

     
     const {fullName,username,email,password} = req.body    //get the data from the body  

    
     if([fullName,username,email,password].some((field)=> field?.trim() === "")){
         throw new ApiError(400,"All Fields are required")
     }
     // check if the user already exist in the database
     const checkExist = await User.findOne({
        $or:[{ email },{ username }]
     })

     if(checkExist){
          throw new ApiError(409,'user with email or username alreay exist')
     }
     
     // get the localFilePath from the req.files object
     const avatarLocalFilePath = req.files?.avatar?.[0]?.path;  
     const coverImageLocalFilePath = req.files?.coverImage?.[0]?.path
     
     if(!avatarLocalFilePath){
          throw new ApiError(400,'Avatar File is required')
     }

    // upload the Files On the cloudinary 
    const avatar = await uploadOnCloudinary(avatarLocalFilePath);
    const coverImage = await uploadOnCloudinary(coverImageLocalFilePath);
 

    if(!avatar){
     throw new ApiError(400,"Avatar File  is required")
    }
     //create new User Entry in the Database
     const user = await User.create({
       fullName,
       avatar:avatar.url,
       coverImage:coverImage?.url || "",
       email,
       password,
       username:username.toLowerCase()
     })
      
     // remove the password and refresh token from the response and check if the user is created or not
     const createdUser = await User.findById(user._id).select("-password  -refreshToken")

     if(!createdUser){
          throw new ApiError(500,"Something went wrong while registering the user");
     }
     // send the response with the createduser 
     return res.status(201).json(
          new ApiResponse(200,createdUser,"User Register Successfully")
     )
})


export default {registerUser}


