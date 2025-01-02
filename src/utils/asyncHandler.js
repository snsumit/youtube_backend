export const asyncHandler = (requestHandler) =>{
    return (req,res,next)=>{
         Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error))
    }
}


/*
const asyncHandler = (fn) => async (req,res,next) => {
   try {
      await fn(req,res,next)   
   } catch (error) {
     res.send(error.status || 500 ,{
        success:false,
        message:error.message
     })
   }
}
*/




