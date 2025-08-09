import { PrismaClient, Role } from "@prisma/client";

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

        console.log("updated: ",updatedUser)
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
