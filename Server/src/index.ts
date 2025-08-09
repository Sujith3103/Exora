import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import http from "http";
import { Server } from "socket.io";
import multer from "multer";

//routes 
import auth_route from './routes/auth_route'
import user_route from './routes/user_route'

// -------------------- CONFIG --------------------
dotenv.config();
const app = express();
const upload = multer();
app.use(upload.none());


app.use(cors());
app.use(express.json());

//-------------------- ROUTE REGISTER --------------------

app.use('/api/auth', auth_route)
app.use('/api/user',user_route)

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
app.listen(process.env.PORT, () => {
  console.log("Server running on port 8800");
});
