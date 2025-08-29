import { Router } from "express";
import { student_GetAllCourses, student_GetCourseDetails } from "../../controllers/user/course-controller";

const router = Router()

router.get('/', student_GetAllCourses)

router.get('/:courseId',student_GetCourseDetails)

export default router