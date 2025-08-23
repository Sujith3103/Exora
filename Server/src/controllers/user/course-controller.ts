import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient()

export const student_GetAllCourses = async (req: Request, res: Response) => {
    const pageNum = Number(req.query.page) || 1;
    const limitNum = Number(req.query.limit) || 10;
    const skip = (pageNum - 1) * limitNum;


    try {


        const result = await prisma.course.findMany({
            where: { status: 'published' },
            skip,
            take: limitNum,
        });

        return res.status(200).json({
            success:true,
            message:"fetch course successfully",
            data:result
        })


    } catch (err) {

    }
}