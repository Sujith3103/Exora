import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
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
  role: 'USER' | 'ADMIN'; // or string if you have more roles
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUserPayload;
  }
}

//routes 
import auth_route from './routes/auth_route';
import user_route from './routes/user_route';

// -------------------- CONFIG --------------------
dotenv.config();
const app = express();
const upload = multer();
app.use(upload.none());

app.use(cors());
app.use(express.json());

//-------------------- ROUTE REGISTER --------------------

app.use('/api/auth', auth_route);
app.use('/api/user', user_route);

// -------------------- SUPABASE --------------------
const supabaseUrl = "https://aywktugruubporzskjdt.supabase.co";
const supabaseKey = process.env.SUPABASE_kEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// -------------------- SOCKET.IO -------------------
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://exora-livid.vercel.app/"],
    credentials: true,
  },
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 8800;

async function startServer() {
  try {
    await initRedis(); // <--- Connect Redis first
    console.log("Redis connected successfully");

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect Redis or start server:", error);
    process.exit(1);
  }
}

startServer();
