import { Router } from "express";
import { AddNewCourse, CreateLecture, createResource, CreateSection, deleteCourse, deleteLecture, deleteResource, deleteSection, GetAllCourses, GetAllSections, getCourseLanding, getCourseTitles, publishCourse, updateCourseLanding, UpdateLectureTitle, UpdateSectionTitle } from "../../controllers/instructor/course-controller";
import { AuthenticateMiddleware } from "../../middleware";

import multer from "multer";
const upload = multer();

const router = Router()


router.post('/create-new', AuthenticateMiddleware, AddNewCourse)
router.post('/create-section/:id', AuthenticateMiddleware, CreateSection)
router.post('/create-lecture/:id', AuthenticateMiddleware, CreateLecture)
// Create a resource under a lecture
router.post("/sections/:sectionId/lectures/:lectureId/resources",AuthenticateMiddleware,upload.none(),createResource);


router.put('/:courseId/landing', AuthenticateMiddleware, updateCourseLanding)

router.patch('/:courseId/sections/:sectionId/title', AuthenticateMiddleware, UpdateSectionTitle)
router.patch('/:sectionId/lectures/:lectureId/title', AuthenticateMiddleware, UpdateLectureTitle)
router.patch('/:courseId/publish', AuthenticateMiddleware, publishCourse)

router.delete('/:courseId/sections/:sectionId', AuthenticateMiddleware, deleteSection)
router.delete('/:sectionId/lectures/:lectureId', AuthenticateMiddleware, deleteLecture)
router.delete('/sections/:sectionId/lectures/:lectureId/resources/:resourceId', AuthenticateMiddleware, deleteResource)
router.delete('/:courseId',AuthenticateMiddleware,deleteCourse)

router.get('/get-all-sections/:id', AuthenticateMiddleware, GetAllSections)
router.get('/get-all-courses', AuthenticateMiddleware, GetAllCourses)
router.get('/:courseId/landing', AuthenticateMiddleware, getCourseLanding)
router.get('/titles', AuthenticateMiddleware, getCourseTitles)
// router.get('/sections/:sectionId/lectures', AuthenticateMiddleware, )



export default router