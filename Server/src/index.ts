import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import { createClient } from '@supabase/supabase-js'

const app = express();
dotenv.config()

const supabaseUrl = 'https://aywktugruubporzskjdt.supabase.co'
const supabaseKey = process.env.SUPABASE_kEY!
const supabase = createClient(supabaseUrl, supabaseKey)

app.use(cors());
app.use(express.json());
const router = express.Router();
app.use("/", router); // 👈 Add this line before app.listen

router.get('/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');

  if (error) {
    return res.status(500).json({ 
      message: "not found"
    });
  }

  return res.json(data);
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port 8800");
});

