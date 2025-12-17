import { Router } from "express";
import { getLearn, getPopularCourses, markLectureComplete, pingLecture, purchaseCourse, returnStatus, student_GetAllCourses, student_GetCourseDetails } from "../../controllers/user/course-controller";
import { AuthenticateMiddleware } from "../../middleware";
import { getCourseMessage, updateCourseMessage } from "../../controllers/instructor/course-controller";

const router = Router()

router.get('/', student_GetAllCourses)
router.get('/popular',getPopularCourses )
router.get('/:courseId', student_GetCourseDetails)
router.get('/:courseId/learn', AuthenticateMiddleware,getLearn)
router.get('/:courseId/message', AuthenticateMiddleware, getCourseMessage)
router.get('/lecture/:lectureId/status', AuthenticateMiddleware, returnStatus)


router.post('/:courseId/purchase', AuthenticateMiddleware, purchaseCourse)
router.post('/:lectureId/ping',AuthenticateMiddleware,pingLecture)
router.post('/lecture/:lectureId/complete',AuthenticateMiddleware,markLectureComplete)

router.put(`/:courseId/message`, AuthenticateMiddleware, updateCourseMessage)


export default router