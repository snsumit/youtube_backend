import { Video } from "../models/video.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import {v2 as cloudinary} from 'cloudinary' 
const publishVideo=asyncHandler(async(req,res)=>{
     const {title,description}=req.body
     if(!title || !description){
       throw new ApiError(400,"All fields are required")
     }
     const videoFileLocalFilePath=req.files?.videoFile?.[0]?.path
     const thumbnailLocalFilePath=req.files?.thumbnail?.[0]?.path
     if(!videoFileLocalFilePath || !thumbnailLocalFilePath){
        throw new ApiError(400,"Video File and thumbnail file is required")
     }
     const videoFile=await uploadOnCloudinary(videoFileLocalFilePath)
     const thumbnail=await uploadOnCloudinary(thumbnailLocalFilePath)
     if(!videoFile || !thumbnail){
        throw new ApiError(400,"videoFile and thumbnail file is required")
     }
     const newVideo=await Video.create({
      videoFile:videoFile?.url,
      thumbnail:thumbnail?.url,
      title,
      description,
      duration:videoFile?.duration,
      owner:req?.user?._id
     })
     if(!newVideo){
      throw new ApiError(500,"Something went wrong")
     }
     res
     .status(201)
      .json(
         new ApiResponse(201,newVideo,"Video uploaded Successfully")
      )
     
})
const videoFileUpdate=asyncHandler(async(req,res)=>{
   console.log(req.query)
   const {_id}=req.query
   console.log(_id)
   const {title,description}=req.body
   const thumbnailLocalFilePath=req?.file?.path
   if(!title || !description || !thumbnailLocalFilePath){
      throw new ApiError(400,"Title or description and thumbnailLocalFilePath are required")
   }
   const video=await Video.findById(_id);
   if(!video){
      throw new ApiError(400,"Invalid video Id , video not found")
   }
   //Delete URL
   const publicId = video.thumbnail.split('/').pop().split('.')[0];
   await cloudinary.uploader.destroy(publicId);

   const thumbnail=await uploadOnCloudinary(thumbnailLocalFilePath)
   const updatedVideo=await Video.findByIdAndUpdate(_id,{
      $set:{
         thumbnail:thumbnail?.url,
         title,
         description
      }
   },{new:true})
   res
   .status(200)
   .json(
      new ApiResponse(200,updatedVideo,"Video Updated Successfully")
   )
})
const getVideoById=asyncHandler(async(req,res)=>{
   const {_id}=req.query
   const publishedVideo=await Video.findById(_id)
   if(!publishedVideo){
      throw new ApiError(400,"Invalid video id, video not found");
   }
  res
  .status(200)
  .json(
   new ApiResponse(200,publishedVideo,"Get the video Successfully")
  )
})
const deleteVideo=asyncHandler(async(req,res)=>{
   const {_id}=req.query
   const deletevideo=await Video.findByIdAndDelete(_id)
   if(!deletevideo){
      throw new ApiError(400,"Invalid video Id")
   }
   //delete URL
   const VideopublicId =deletevideo.videoFile.split('/').pop().split('.')[0];
   await cloudinary.uploader.destroy(VideopublicId);
   const thumbnailpublicId = deletevideo.thumbnail.split('/').pop().split('.')[0];
   await cloudinary.uploader.destroy(thumbnailpublicId);

   res
   .status(200)
   .json(
      new ApiResponse(200,deletevideo,"Deleted video Successfully")
   )
})
export default {publishVideo,videoFileUpdate,getVideoById,deleteVideo}