import { Router } from "express";
import multer from "multer";
import { uploadMediaToCloudinary } from "../utils/cloudinary";
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
                    profileimg: result.secure_url,
                    profileimgId: result.public_id, // store Cloudinary public_id too
                },
                create: {
                    userId: userId,
                    profileimg: result.secure_url,
                    profileimgId: result.public_id,
                }
            });

            await client.hSet(userProfileKey, {
                contact: user?.contact || '',
                dob: user?.dob ? new Date(user?.dob).toISOString() : '',
                gender: user?.gender || '',
                profession: user?.profession || '',
                about: user?.about || '',
                profileImg: user?.profileimg || '',
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

router.post('/lecture/:lectureId/assets', upload.single("file"), AuthenticateMiddleware, async (req, res) => {
    const userId = req.user?.id as string;
    const { lectureId } = req.params;
    const { title, type } = req.body;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!req.file?.path) return res.status(404).json({ success: false, message: "File not found" });

    // Create asset in DB first with "pending" status
    let createdLectureAsset = await prisma.lectureAsset.create({
        data: {
            title: title,
            type: type,
            url: '',
            publicId: '',
            lectureId: lectureId,
            status: 'uploading',  // start as pending
        }
    });

    try {
        const result = await uploadMediaToCloudinary(req.file.path);

        // Generate a thumbnail URL from the uploaded video
        const thumbnailUrl = cloudinary.url(result.public_id, {
            resource_type: "video",   // important for videos
            format: "jpg",
            start_offset: "2",        // pick frame at 2 seconds
            width: 70,               // optional: resize
            height: 50,
            crop: "fill"
        });

        // Update asset with real URL, publicId, thumbnail, and mark as published
        createdLectureAsset = await prisma.lectureAsset.update({
            where: { id: createdLectureAsset.id },
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                thumbnailUrl: thumbnailUrl,  // store thumbnail
                status: 'published',
            },
        });

        console.log("lecture asset : ", createdLectureAsset)
        res.status(200).json({ success: true, message: "created asset successfully", asset: createdLectureAsset });

    } catch (err) {
        console.error("Upload failed:", err);

        // Mark as failed in DB
        await prisma.lectureAsset.update({
            where: { id: createdLectureAsset.id },
            data: {
                status: 'failed',
            },
        });

        res.status(500).json({ success: false, message: "Upload failed", asset: createdLectureAsset });
    }

});

export default router