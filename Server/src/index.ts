import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from "@prisma/client";


const app = express();
dotenv.config()

const supabaseUrl = 'https://aywktugruubporzskjdt.supabase.co'
const supabaseKey = process.env.SUPABASE_kEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// src/prisma.ts or just prisma.ts



const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());
const router = express.Router();
app.use("/", router); // 👈 Add this line before app.listen

router.get('/users', async (req, res) => {
  const response = await prisma.user.findMany()

  if(response){
    console.log("yes : ",response)
  }

  if (!response) {
    return res.status(500).json({
      message: "not found"
    });
  }

  return res.json(response);
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port 8800");
});

