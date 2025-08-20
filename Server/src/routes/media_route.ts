import { Router } from "express";
import multer from "multer";
import { uploadMediaToCloudinary } from "../utils/cloudinary";
import { AuthenticateMiddleware } from "../middleware";
import { PrismaClient } from "@prisma/client";
import { client } from "../utils/redis";
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
    console.log("file : ", req.file)

    const { title, type } = req.body

    const userId = req.user?.id as string
    const { lectureId } = req.params;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" })
    if (!req.file?.path) return res.status(404).json({ success: false, message: "file not found" })

    const filePath = req.file.path
    console.log("file path : ", filePath)
    const createdLectureAsset = await prisma.lectureAsset.create({
        data: {
            title: title,
            type: type,
            publicId: '',
            url: '',
            lectureId: '',
            status: 'pending',
        }
    })

    


});

export default router