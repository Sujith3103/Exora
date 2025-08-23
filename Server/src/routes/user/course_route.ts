import { Router } from "express";
import { student_GetAllCourses } from "../../controllers/user/course-controller";

const router = Router()

router.get('/', student_GetAllCourses)

export default router