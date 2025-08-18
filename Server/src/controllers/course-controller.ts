import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";


const prisma = new PrismaClient();

export const AddNewCourse = async (req: Request, res: Response) => {

    const userId = req.user?.id as string
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" })

    try {

        const instructor = await prisma.user.findFirst({
            where: { id: userId }
        })

        if (instructor?.role !== 'INSTRUCTOR') return res.status(401).json({ success: false, message: "Unauthorized" })

        const newCourse = await prisma.course.create({
            data: {
                title: "",
                category: "",
                level: "",
                primaryLanguage: "",
                subtitle: "",
                language: "",
                description: "",
                pricing: 0,
                objectives: "",
                welcomeMessage: "",
                image: "",
                requirements: [],          // empty array for Json
                searchkey: "",
                slug:  `temp-slug-${Date.now()}`,         // must be unique
                lengthNum: 0,
                lengthStr: "",
                status: "drafted",         // default enum value
                instructorId: userId,

            }
        });

        console.log("course: ", newCourse)

        res.status(200).json({
            success: true,
            message: "course created successfully",
            newCourse
        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "failed creating a new course"
        })
    }

}
export const GetAllCourses = async (req: Request, res: Response) => {

    const userId = req.user?.id as string
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" })

    try {

        // Get all courses by an instructor
        const instructorCourses = await prisma.course.findMany({
            where: { instructorId: userId },
            select:{
                id:true,
                title: true,
                level: true,
                category: true,
                image: true,
                pricing: true,
                status: true,
                lengthStr: true
            }
        });

        if(!instructorCourses) return res.status(404).json({success :false, message: "courses not found"})

        console.log("instructor courses : ", instructorCourses)

        return res.status(200).json({
            success : true,
            message:"fetched instructor courses",
            instructorCourses: instructorCourses
        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "failed fetching courses"
        })
    }

}
