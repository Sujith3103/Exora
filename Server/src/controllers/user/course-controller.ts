import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient()

export const student_GetAllCourses = async (req: Request, res: Response) => {
    try {
        const pageNum = Number(req.query.page) || 1;
        const limitNum = Number(req.query.limit) || 10;
        const category = req.query.category as string | undefined;

        const skip = (pageNum - 1) * limitNum;

        const where: any = { status: 'published' };
        if (category) {
            where.category = category; // filter by category if passed
        }
        const [courses, total] = await Promise.all([
            prisma.course.findMany({
                where,
                select: {
                    id: true, title: true, subtitle: true, category: true, thumbnailUrl: true, level: true,
                    pricing: true, primaryLanguage: true, slug: true,
                    instructor: { select: { id: true, name: true, email: true, } }
                },
                skip,
                take: limitNum,
                orderBy: { createdAt: 'desc' }, // optional
            }),
            prisma.course.count({ where }),
        ]);

        res.status(200).json({
            success: true,
            message: "fetched courses successfully",
            data: courses,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const student_GetCourseDetails = async(req: Request, res:Response) => {

    const {courseId} = req.params

    try{

        const details = await prisma.course.findFirst({
            where: {id:courseId},
            include:{instructor:{
                select:{id:true,name:true,email:true,updatedAt:true,role:true,profile:{select:{profession:true}}}
            }}
        })

        if(!details) return res.status(404).json({success:false, message:"course not found"})

        return res.status(200).json({
            success:true,
            message:"fetched course details successfully",
            data:details
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message:"failed to fetch course details"
        })
    }
}

export const purchaseCourse = async(req:Request,res:Response) => {

    const userId = req.user?.id
    const courseId = req.params
    const {originalPrice,discountApplied,finalPrice} = req.body

    try{

        //create a user purchase
        //update user recommendation?
        

        console.log(userId,courseId)
        console.log(originalPrice,discountApplied,finalPrice)
        // const res = await prisma.userPurchase.create({
        //     data:{
                
        //     }
        // })

    }catch(err){

    }
}