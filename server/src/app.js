import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser" 
import mongoose from "mongoose"
const app = express()

import dotenv from 'dotenv';
dotenv.config();

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests if:
    // - Origin is in the allowed list
    // - OR origin is undefined (like Postman or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS Not Allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
}));

app.get("/api/v1", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
    database: dbStatus,
    time: new Date().toISOString(),
  });
});

app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import 
import userRouter  from './routes/user.routes.js'
import listingRouter from './routes/listing.routes.js'
import bookingRouter from './routes/booking.routes.js'
// route declaration
app.use('/api/v1/users',userRouter)
app.use('/api/v1/listings',listingRouter)
app.use('/api/v1/bookings',bookingRouter)
// http://localhost:8000/api/v1/users/register

export { app }