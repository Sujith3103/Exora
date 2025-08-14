import sharp from "sharp";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Router } from "express";
import { AuthenticateMiddleware } from "../middleware";
import { uploadMediaToCloudinary } from "../utils/cloudinary";
import { PrismaClient } from "@prisma/client";

// Multer config
const upload = multer({ dest: "uploads/" });
const router = Router()
const prisma = new PrismaClient();


router.post(
  "/set-profile-img",
  upload.single("profileImage"),
  AuthenticateMiddleware,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      const resizedPath = path.join("uploads", `resized-${Date.now()}.jpg`);

      // Resize to 93x93 and compress
      await sharp(req.file.path)
        .resize(93, 93, { fit: "cover" }) // fit cover for exact square
        .jpeg({ quality: 80 }) // adjust quality for compression
        .toFile(resizedPath);

      // Upload resized image to Cloudinary
      const result = await uploadMediaToCloudinary(resizedPath);

      // Save URL in DB
      const userId = req.user?.id as string;
      await prisma.userProfile.upsert({
        where: { userId },
        update: { profileimg: result.secure_url },
        create: { userId, profileimg: result.secure_url }
      });

      // Cleanup temp files
      fs.unlinkSync(req.file.path);
      fs.unlinkSync(resizedPath);

      res.json({ success: true, url: result.secure_url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Upload failed" });
    }
  }
);
