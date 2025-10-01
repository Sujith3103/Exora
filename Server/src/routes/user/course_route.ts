import { Router } from "express";
import { purchaseCourse, student_GetAllCourses, student_GetCourseDetails } from "../../controllers/user/course-controller";
import { AuthenticateMiddleware } from "../../middleware";
import { getCourseMessage, updateCourseMessage } from "../../controllers/instructor/course-controller";

const router = Router()

router.get('/', student_GetAllCourses)

router.get('/:courseId', student_GetCourseDetails)
router.get('/:courseId/message', AuthenticateMiddleware, getCourseMessage)


router.post('/:courseId/purchase', AuthenticateMiddleware, purchaseCourse)

router.put(`/:courseId/message`, AuthenticateMiddleware, updateCourseMessage)


export default router