import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (userId) => {
     try {
          // find the user with the useId
          const user = await User.findById(userId)
          const accessToken = user.generateAccessToken();
          const refreshToken = user.generateRefreshToken();

          //   set the refreshToken to the user
          user.refreshToken = refreshToken;
          await user.save({ validateBeforeSave: false })   //option for the validation will not perform by mongoose
          // return the accessToken and refreshToken as a object
          return { accessToken, refreshToken }
     } catch (error) {
          throw new ApiError(500, "Something went wrong while generating the access and refresh tokens")
     }
}


const registerUser = asyncHandler(async (req, res) => {
     //   get the user detail from the frontend
     //   validation - not empty 
     //   check if user already exists :username ,email
     //   check for images , check for avatar
     //   upload them to cloudinary , check avatar
     //   create user Object - create entry in db 
     //   remove password and refresh token field from response 
     //   check for user creation
     //   return res


     const { fullName, username, email, password } = req.body    //get the data from the body  


     if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
          throw new ApiError(400, "All Fields are required")
     }
     // check if the user already exist in the database
     const checkExist = await User.findOne({
          $or: [{ email }, { username }]
     })

     if (checkExist) {
          throw new ApiError(409, 'user with email or username alreay exist')
     }

     // get the localFilePath from the req.files object
     const avatarLocalFilePath = req.files?.avatar?.[0]?.path;
     const coverImageLocalFilePath = req.files?.coverImage?.[0]?.path

     if (!avatarLocalFilePath) {
          throw new ApiError(400, 'Avatar File is required')
     }

     // upload the Files On the cloudinary 
     const avatar = await uploadOnCloudinary(avatarLocalFilePath);
     const coverImage = await uploadOnCloudinary(coverImageLocalFilePath);


     if (!avatar) {
          throw new ApiError(400, "Avatar File  is required")
     }
     //create new User Entry in the Database
     const user = await User.create({
          fullName,
          avatar: avatar.url,
          coverImage: coverImage?.url || "",
          email,
          password,
          username: username.toLowerCase()
     })

     // remove the password and refresh token from the response and check if the user is created or not
     const createdUser = await User.findById(user._id).select("-password  -refreshToken")

     if (!createdUser) {
          throw new ApiError(500, "Something went wrong while registering the user");
     }
     // send the response with the createduser 
     return res.status(201).json(
          new ApiResponse(200, createdUser, "User Register Successfully")
     )
})


const loginUser = asyncHandler(async (req, res) => {

     //  get the data from the frontend   
     //  validate the data username or email
     //  user exist or not
     //  password check
     //  generate access and refreshToken
     //  send cookie

     // get the data from the frontend

     const { username, email, password } = req.body;

     // validate the data

     if (!username && !email) {
          throw new ApiError(400, "Username or email is required")
     }

     const user = await User.findOne({
          $or: [{ username }, { email }]
     })

     //check if user exist or not

     if (!user) {
          throw new ApiError(404, "User does not exist")
     }

     //compare the password with the our own defined method isPassword correct which 
     //available on the created or find user   

     const isPasswordValid = await user.isPasswordCorrect(password)

     //Password validation

     if (!isPasswordValid) {
          throw new ApiError(401, "Invalid user Credentials")
     }

     //generate the accessToken and refreshToken

     const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

     // get the latest user detail after adding the refresh token

     const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

     // options for the cookies so that it can be only modified by the server

     const options = {
          httpOnly: true,
          secure: true,
     }

     // return response with the cookies set to the user cookies

     return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(
               new ApiResponse(200,
                    {
                         user: loggedInUser, accessToken, refreshToken
                    },
                    "User logged In Successfully "
               )
          )

})


const logoutUser = asyncHandler(async (req, res) => {
     await User.findByIdAndUpdate(req?.user?._id, {
          $set: {
               refreshToken: "",
          }
     });
     const options = {
          httpOnly: true,
          secure: true
     }

     return res
          .status(200)
          .clearCookie('accessToken', options)
          .clearCookie('refreshToken', options)
          .json(new ApiResponse(200, {}, "User Logout SuccessFully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {

     // user refresh token 
     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken


     if (!incomingRefreshToken) {
          throw new ApiError(400, "Unauthorized access")
     }

     try {
     // decode the token 
          const decodedToken = jwt.verify(
               incomingRefreshToken,
               process.env.REFRESH_TOKEN_SECRET,
          )
     //  get the user with the help of id in the refresh or decoded token
          const user = await User.findById(decodedToken?._id);

          if (!user) {
               throw new ApiError(401, "Invalid refresh Token");
          }

     // check for the token are same or not  
          if (incomingRefreshToken !== user?.refreshToken) {
               throw new ApiError(401, "Refresh Token is used or expired")
          }

     // genrate new accessToken and refreshToken for the user 
          const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
          
     
          const options = {
               httpOnly: true,
               secure: true,
          }
 
          return res
               .status(200)
               .cookie("accessToken", accessToken, options)
               .cookie("refreshToken", refreshToken, options)
               .json(
                    new ApiResponse(200, { accessToken,refreshToken }, "Access Token Refreshed")
               )

     } catch (error) {
          throw new ApiError(401, error?.message || "invalid Refresh token")
     }
})


const changeCurrentPassword = asyncHandler(async (req, res) => {
    
     // get the old and new password from the user
     const { oldPassword, newPassword } = req.body;


     if (!oldPassword || !newPassword) {
          throw new ApiError(400, "Old password and new password are required");
     }
 
     // find the user in the database to change the password
     const user = await User.findById(req.user?._id);

     if (!user) {
          throw new ApiError(404, "User not found");
     }

     // check if the oldpassword is valid
     const isOldPasswordValid = await user.isPasswordCorrect(oldPassword);

     if (!isOldPasswordValid) {
          throw new ApiError(401, "Old password is incorrect");
     }

     // change The password
     user.password = newPassword;
     // save the user with the new password
     await user.save({validateBeforeSave: false});

     return res
     .status(200)
     .json(
          new ApiResponse(200, {}, "Password changed successfully")
     );
});
 
const getCurrentUser = asyncHandler(async (req,res)=>{
     return res.status(200).json(
          new ApiResponse(200,{user:req.user},"Successfully get the user details")
     )
})


export default { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword , getCurrentUser }







