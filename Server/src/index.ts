import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import http from "http";
import { Server } from "socket.io";
import multer from "multer";

import { client as redisClient, initRedis } from "./utils/redis"; // <--- import Redis client/init


// types/express/index.d.ts
import { JwtPayload } from 'jsonwebtoken';


export interface AuthUserPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'DEVELOPER'; // or string if you have more roles
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUserPayload;
  }
}

//routes 
import auth_route from './routes/auth_route';
import user_route from './routes/user/user_route';
import cart_route from './routes/user/cart_route';
import media_route from './routes/media_route'
import instructor_course_route from './routes/instructor/course_route'
import coupon_route from './routes/instructor/coupon_route'
import validateCoupon_route from './routes/user/coupon_route'
import course_route from './routes/user/course_route'
import message_route from './routes/user/message_route'
import trackEvent_route from './routes/click'
import analytics_route from './routes/instructor/analytics_route'
import DLQ_Route from './routes/developer/DLQ_route'
import { connectRedis, redis } from "./utils/redisClient";
import { socketConnection } from "./config/socket";
import { initSocket } from "./socket";
// -------------------- CONFIG --------------------
dotenv.config();
const app = express();
const upload = multer();

app.use(cors({
  origin: ["http://localhost:5173", "https://exora-livid.vercel.app"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//-------------------- ROUTE REGISTER --------------------

app.use('/api/auth', auth_route);
app.use('/api/user', user_route);
app.use('/api/user/cart', cart_route);
app.use('/api/media', media_route);
app.use('/api/courses', course_route);
app.use('/api/course', course_route);
app.use('/api/progress', course_route);
app.use('/api/communication', message_route);
app.use('/api/validate/coupon', validateCoupon_route)
app.use('/api/track-click', trackEvent_route)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

//instructor
app.use('/api/instructor/course', instructor_course_route)
app.use('/api/instructor/coupon', coupon_route)
app.use('/api/instructor/analytics', analytics_route)

//DEVELOPER
app.use('/api/developer/dead-letter-queue', DLQ_Route)

// -------------------- SUPABASE --------------------
const supabaseUrl = "https://aywktugruubporzskjdt.supabase.co";
const supabaseKey = process.env.SUPABASE_kEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
// -------------------- SOCKET.IO -------------------
const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://exora-livid.vercel.app"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  },
});

initSocket( )

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 8800;

async function startServer() {
  try {
    // await initRedis();
    await connectRedis();
    // <--- Connect Redis first
    console.log("Redis connected successfully");

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    }); 
  } catch (error) {
    console.error("Failed to connect Redis or start server:", error);
    process.exit(1);
  }
}
process.on("SIGINT", async () => {
  console.log("Shutting down worker...");
  try {
    await redis.quit();
  } catch (err) {
    console.error("Error closing Redis:", err);
  } finally {
    process.exit(0);
  }
});

process.on("SIGTERM", async () => {
  console.log("Worker terminated...");
  try {
    await redis.quit();
  } catch (err) {
    console.error("Error closing Redis:", err);
  } finally {
    process.exit(0);
  }
});

startServer();
