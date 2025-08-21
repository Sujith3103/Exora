import { Router } from "express";
import { AddNewCourse, CreateLecture, CreateSection, deleteLecture, deleteSection, GetAllCourses, GetAllSections, UpdateLectureTitle, UpdateSectionTitle } from "../controllers/course-controller";
import { AuthenticateMiddleware } from "../middleware";

const router = Router()

router.post('/create-new',AuthenticateMiddleware,AddNewCourse)
router.post('/create-section/:id',AuthenticateMiddleware,CreateSection)
router.post('/create-lecture/:id',AuthenticateMiddleware,CreateLecture)

router.patch('/:courseId/sections/:sectionId/title',AuthenticateMiddleware,UpdateSectionTitle)
router.patch('/:sectionId/lectures/:lectureId/title',AuthenticateMiddleware,UpdateLectureTitle)

router.delete('/:courseId/sections/:sectionId',AuthenticateMiddleware,deleteSection)
router.delete('/:sectionId/lectures/:lectureId',AuthenticateMiddleware,deleteLecture)

router.get('/get-all-sections/:id',AuthenticateMiddleware,GetAllSections)
router.get('/get-all-courses',AuthenticateMiddleware,GetAllCourses)



export default router