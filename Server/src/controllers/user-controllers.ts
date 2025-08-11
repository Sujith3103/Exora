import { PrismaClient, Role } from "@prisma/client";
import { Request, Response } from "express";
import { client } from "../utils/redis";

const prisma = new PrismaClient();

export const ChangeRole = async (req: any, res: any) => {
    try {
        const { id } = req.user; // coming from JWT middleware

        // Find the user first
        const userData = await prisma.user.findUnique({
            where: { id },
        });

        if (!userData) {
            return res.status(401).json({
                success: false,
                message: "Could not find the user",
            });
        }

        // Update role to INSTRUCTOR
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role: Role.INSTRUCTOR },
        });

        console.log("updated: ", updatedUser)
        return res.status(200).json({
            success: true,
            message: "User role updated to INSTRUCTOR",
            user: updatedUser,
        });

    } catch (error) {
        console.error("Error changing role:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while changing role",
        });
    }
};


export const EditUserProfile = async (req: Request, res: Response) => {
    const userData = req.body;
    const user = req.user

    const userProfileKey = `user:profile:${user?.id}`;

    console.log("id : ", user?.id)
    try {
        // 1. Update DB
        const createdProfile = await prisma.userProfile.upsert({
            where: { userId: user?.id }, // match existing
            update: {
                ...userData,
                contact: userData.contact?.trim() || null,
                dob: userData.dob ? new Date(userData.dob) : null
            },
            create: {
                ...userData,
                contact: userData.contact?.trim() || null,
                dob: userData.dob ? new Date(userData.dob) : null,
                user: {
                    connect: { id: user?.id }
                }
            }
        });

        console.log("DB profile created:", createdProfile);

        // 2. Update cache (Write-through strategy)
        await client.hSet(userProfileKey, {
            contact: userData.contact || '',
            dob: userData.dob ? new Date(userData.dob).toISOString() : '',
            gender: userData.gender || '',
            profession: userData.profession || '',
        });

        // 3. Set TTL (10 mins)
        await client.expire(userProfileKey, 600);

        // 4. Respond once
        return res.status(200).json({
            success: true,
            message: "User profile was updated successfully"
        });

    } catch (err) {
        console.error("Error updating profile:", err);

        return res.status(500).json({
            success: false,
            message: "Failed updating the profile"
        });
    }
};


export const EditUserSecurity = async (req: Request, res: Response) => {
    console.log(req.body)
}