import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

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

     const checkExist = await User.findOne({
        $or:[{ email },{ username }]
     })

     if(checkExist){
          throw new ApiError(409,'user with email or username alreay exist')
     }
     






      
     
     
})


export default {registerUser}


