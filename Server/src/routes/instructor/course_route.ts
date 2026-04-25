import { Router } from "express";
import { AddNewCourse, CreateLecture, createResource, CreateSection, deleteCourse, deleteLecture, deleteResource, deleteSection, GetAllCourses, GetAllSections, getCourseLanding, getCourseTitles, publishCourse, updateCourseLanding, UpdateLectureTitle, UpdateSectionTitle } from "../../controllers/instructor/course-controller";
import { AuthenticateMiddleware } from "../../middleware";

import multer from "multer";
import { rateLimitMiddleWare } from "../../middleware/rateLimit";
const upload = multer();

const router = Router()


router.post('/create-new', AuthenticateMiddleware,rateLimitMiddleWare(), AddNewCourse)
router.post('/create-section/:id', AuthenticateMiddleware,rateLimitMiddleWare(), CreateSection)
router.post('/create-lecture/:id', AuthenticateMiddleware,rateLimitMiddleWare(), CreateLecture)
// Create a resource under a lecture
router.post("/sections/:sectionId/lectures/:lectureId/resources",AuthenticateMiddleware,rateLimitMiddleWare(),upload.none(),createResource);


router.put('/:courseId/landing', AuthenticateMiddleware,rateLimitMiddleWare(), updateCourseLanding)

router.patch('/:courseId/sections/:sectionId/title', AuthenticateMiddleware,rateLimitMiddleWare(), UpdateSectionTitle)
router.patch('/:sectionId/lectures/:lectureId/title', AuthenticateMiddleware,rateLimitMiddleWare(), UpdateLectureTitle)
router.patch('/:courseId/publish', AuthenticateMiddleware,rateLimitMiddleWare(), publishCourse)

router.delete('/:courseId/sections/:sectionId', AuthenticateMiddleware,rateLimitMiddleWare(), deleteSection)
router.delete('/:sectionId/lectures/:lectureId', AuthenticateMiddleware,rateLimitMiddleWare(), deleteLecture)
router.delete('/sections/:sectionId/lectures/:lectureId/resources/:resourceId', AuthenticateMiddleware,rateLimitMiddleWare(), deleteResource)
router.delete('/:courseId',AuthenticateMiddleware,rateLimitMiddleWare(),deleteCourse)

router.get('/get-all-sections/:id', AuthenticateMiddleware,rateLimitMiddleWare(), GetAllSections)
router.get('/get-all-courses', AuthenticateMiddleware,rateLimitMiddleWare(), GetAllCourses)
router.get('/:courseId/landing', AuthenticateMiddleware,rateLimitMiddleWare(), getCourseLanding)
router.get('/titles', AuthenticateMiddleware,rateLimitMiddleWare(), getCourseTitles)
// router.get('/sections/:sectionId/lectures', AuthenticateMiddleware,rateLimitMiddleWare(), )



export default router