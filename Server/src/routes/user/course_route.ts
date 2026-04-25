import { Router } from "express";
import { getLearn, getPopularCourses, markLectureComplete, pingLecture, purchaseCourse, returnStatus, student_GetAllCourses, student_GetCourseDetails } from "../../controllers/user/course-controller";
import { AuthenticateMiddleware } from "../../middleware";
import { getCourseMessage, updateCourseMessage } from "../../controllers/instructor/course-controller";
import { rateLimitMiddleWare } from "../../middleware/rateLimit";

const router = Router()

router.get('/', student_GetAllCourses)
router.get('/popular',getPopularCourses )
router.get('/:courseId', student_GetCourseDetails)
router.get('/:courseId/learn', AuthenticateMiddleware, rateLimitMiddleWare(),getLearn)
router.get('/:courseId/message', AuthenticateMiddleware, rateLimitMiddleWare(), getCourseMessage)
router.get('/lecture/:lectureId/status', AuthenticateMiddleware, rateLimitMiddleWare(), returnStatus)

 
router.post('/:courseId/purchase', AuthenticateMiddleware, rateLimitMiddleWare(), purchaseCourse)
router.post('/:lectureId/ping',AuthenticateMiddleware, rateLimitMiddleWare(),pingLecture)
router.post('/lecture/:lectureId/complete',AuthenticateMiddleware, rateLimitMiddleWare(),markLectureComplete)

router.put(`/:courseId/message`, AuthenticateMiddleware, rateLimitMiddleWare(), updateCourseMessage)


export default router