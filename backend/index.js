import express from 'express'
import cors from 'cors'
import { config } from 'dotenv';
import useRouter from './routes/user.js';
import tweetRouter from './routes/tweets.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import uploadRouter from './routes/upload.routes.js'

config();

const {PORT} = process.env;

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://twitter-jri7.vercel.app'
  ],
  credentials: true,         
}))

app.use(express.json());
app.use(cookieParser())

app.use('/api/auth',   authRoutes)
app.use('/api/upload', uploadRouter)
app.use("/api/user", useRouter);
app.use("/api/tweets", tweetRouter);




app.get('/', (req, res) => {
    res.send("hi")
})

app.listen(PORT, () => {
    console.log(`Twitter running on port ${PORT}`);
})

export default app;