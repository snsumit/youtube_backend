import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(urlencoded({extended:true}))
app.use(express.static('public'));
app.use(cookieParser())

app.use('/api/v1/users',userRouter)
app.use('/api/v1/videos',videoRouter)

export default app 