import { Router } from "express";
import { purchaseCourse, student_GetAllCourses, student_GetCourseDetails } from "../../controllers/user/course-controller";
import { AuthenticateMiddleware } from "../../middleware";

const router = Router()

router.get('/', student_GetAllCourses)

router.get('/:courseId',student_GetCourseDetails)
router.post('/:courseId/purchase',AuthenticateMiddleware,purchaseCourse)

export default router