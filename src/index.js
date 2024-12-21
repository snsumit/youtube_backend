import dotenv from 'dotenv'
dotenv.config()
import connectDB from "./db/index.js";
import app from './app.js'
import ApiError from './utils/ApiError.js';



connectDB().then(()=>{
    app.listen(process.env.PORT || 3000,()=>{
      console.log(`server is runnning on port ${process.env.PORT}`)
   } )
}).catch((error) => {

   console.log("MongoDB Error :",error)
})





/*
( async ()=>{
    try {
     await mongoose.connect(`${process.env.MOGODB_URI}/${DB_NAME}`)
     app.on('errror',(error)=>{
        console.log("Error :",error);
     })    
     
     app.listen(process.env.PORT,()=>{
        console.log(`listening on port ${process.env.PORT}` )
     })

    }catch (error) {
       console.error("Error :",error);
       throw error   
    }

})()
*/