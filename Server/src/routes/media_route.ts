import { Router } from "express";
import multer from "multer";
import { deleteMediaFromCloudinary, uploadMediaToCloudinary } from "../utils/cloudinary";
import { AuthenticateMiddleware } from "../middleware";
import { PrismaClient } from "@prisma/client";
import { client } from "../utils/redis";
import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs'

const router = Router()
const upload = multer({ dest: "uploads/" });
const prisma = new PrismaClient();


router.post('/set-profile-img', upload.single("profileImage"), AuthenticateMiddleware, async (req, res) => {
  const userId = req.user?.id as string
  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" })


  console.log(req.file)
  const userProfileKey = `user:profile:${userId}`

  try {

    if (req.file?.path) {
      const result = await uploadMediaToCloudinary(req.file?.path)

      const user = await prisma.userProfile.upsert({
        where: { userId: userId },
        update: {
          profileImg: result.secure_url,
          profileImgId: result.public_id, // store Cloudinary public_id too
        },
        create: {
          userId: userId,
          profileImg: result.secure_url,
          profileImgId: result.public_id,
        }
      });

      await client.hSet(userProfileKey, {
        contact: user?.contact || '',
        dob: user?.dob ? new Date(user?.dob).toISOString() : '',
        gender: user?.gender || '',
        profession: user?.profession || '',
        about: user?.about || '',
        profileImg: user?.profileImg || '',
      })
      await client.expire(userProfileKey, 600);
      // fs.unlinkSync(req.file.path);
      res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
    else {
      res.status(200).json({
        success: false,
        message: "File path not found",
      });
    }

  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: "upload failed"
    })
  }
})

router.post(
  "/course/:courseId/lecture/:lectureId/assets",
  upload.single("file"),
  AuthenticateMiddleware,
  async (req, res) => {
    const userId = req.user?.id as string;
    const { lectureId, courseId } = req.params;
    const { title, type } = req.body;

    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!req.file?.path)
      return res.status(404).json({ success: false, message: "File not found" });

    // Create DB record in 'uploading' state
    let lectureAsset = await prisma.lectureAsset.create({
      data: {
        title,
        type,
        url: "",
        publicId: "",
        lectureId,
        status: "uploading",
      },
    });

    try {
      const result = await uploadMediaToCloudinary(req.file.path);
      const isVideo = result.resource_type === "video";
      const duration = isVideo ? result.duration || 0 : 0;

      let thumbnailUrl: string | null = null;
      if (isVideo) {
        thumbnailUrl = cloudinary.url(result.public_id, {
          resource_type: "video",
          format: "jpg",
          start_offset: "2",
          width: 70,
          height: 50,
          crop: "fill",
        });
      }

      // Wrap all DB updates in a single transaction
      await prisma.$transaction(async (tx) => {
        // Update lecture asset
        lectureAsset = await tx.lectureAsset.update({
          where: { id: lectureAsset.id },
          data: {
            url: result.secure_url,
            publicId: result.public_id,
            thumbnailUrl,
            status: "published",
          },
        });

        // Update lecture duration
        if (duration > 0) {
          await tx.lecture.update({
            where: { id: lectureId },
            data: { lengthNum: duration },
          });

          console.log("courseid: ", courseId)
          // Increment course total duration
          await tx.course.update({
            where: { id: courseId },
            data: { lengthNum: { increment: duration } },
          });
        }
      });

      res
        .status(200)
        .json({ success: true, message: "Asset created successfully", asset: lectureAsset });
    } catch (err) {
      console.error("Upload failed:", err);

      // Mark asset as failed
      await prisma.lectureAsset.update({
        where: { id: lectureAsset.id },
        data: { status: "failed" },
      });

      res.status(500).json({ success: false, message: "Upload failed", asset: lectureAsset });
    }
  }
);

/**
 * PUT: Update lecture asset (replace existing file)
 */
router.put(
  "/course/:courseId/lecture/:lectureId/assets/:assetId/edit",
  upload.single("file"),
  AuthenticateMiddleware,
  async (req, res) => {
    const userId = req.user?.id as string;
    const { lectureId, courseId, assetId } = req.params;
    const { title, type } = req.body;

    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!req.file?.path)
      return res.status(404).json({ success: false, message: "File not found" });
    console.log("here")
    try {
      // Fetch old asset
      const oldAsset = await prisma.lectureAsset.findUnique({ where: { id: assetId } });
      if (!oldAsset) return res.status(404).json({ success: false, message: "Asset not found" });

      // Upload new file to Cloudinary
      const result = await uploadMediaToCloudinary(req.file.path);
      const isVideo = result.resource_type === "video";
      const newDuration = isVideo ? result.duration || 0 : 0;

      let thumbnailUrl: string | null = null;
      if (isVideo) {
        thumbnailUrl = cloudinary.url(result.public_id, {
          resource_type: "video",
          format: "jpg",
          start_offset: "2",
          width: 70,
          height: 50,
          crop: "fill",
        });
      }

      // Delete old file from Cloudinary
      if (oldAsset.status != 'failed') {
        await deleteMediaFromCloudinary(oldAsset.publicId);
      }

      let lectureAsset;

      // Wrap all updates in a transaction
      await prisma.$transaction(async (tx) => {
        // If old asset was video, subtract its duration from lecture & course
        if (oldAsset.type === "VIDEO") {
          const lecture = await tx.lecture.findUnique({ where: { id: lectureId } });
          const oldDuration = lecture?.lengthNum || 0;

          await tx.lecture.update({
            where: { id: lectureId },
            data: { lengthNum: oldDuration - oldDuration }, // oldDuration subtraction
          });

          await tx.course.update({
            where: { id: courseId },
            data: { lengthNum: { decrement: oldDuration } },
          });
        }

        // Update lecture asset metadata
        await tx.lectureAsset.update({
          where: { id: assetId },
          data: {
            title,
            type,
            url: result.secure_url,
            publicId: result.public_id,
            thumbnailUrl,
            status: "published",
          },
        });

        // Add new video duration
        if (newDuration > 0) {
          await tx.lecture.update({
            where: { id: lectureId },
            data: { lengthNum: newDuration },
          });

          lectureAsset = await tx.course.update({
            where: { id: courseId },
            data: { lengthNum: { increment: newDuration } },
          });
        }
      });

      res.status(200).json({ success: true, message: "Asset updated successfully",  asset: lectureAsset});
    } catch (err) {
      console.error("Update failed:", err);
      res.status(500).json({ success: false, message: "Update failed" });
    }
  }
);


router.patch('/course/:courseId/thumbnail', upload.single('thumbnail'), async (req, res) => {
  const { courseId } = req.params;

  if (!req.file?.path) {
    return res.status(404).json({ success: false, message: "file not found" });
  }

  try {
    // Find the course first
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { thumbnailId: true },
    });

    // If there’s an existing thumbnail, delete it from Cloudinary
    if (course?.thumbnailId) {
      // await cloudinary.uploader.destroy(course.thumbnailId);
      await deleteMediaFromCloudinary(course.thumbnailId)
    }

    // Upload new thumbnail to Cloudinary
    const result = await uploadMediaToCloudinary(req.file.path);

    // Update course with new thumbnail
    const upload = await prisma.course.update({
      where: { id: courseId },
      data: {
        thumbnailId: result.public_id,
        thumbnailUrl: result.secure_url,
      },
    });

    console.log("updated img:", upload)

    return res.status(200).json({
      success: true,
      message: "Thumbnail uploaded successfully",
      url: upload.thumbnailUrl,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Upload failed" });
  }
});


export default router