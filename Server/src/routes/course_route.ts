import { Router } from "express";
import { AddNewCourse, CreateSection, GetAllCourses, GetAllSections } from "../controllers/course-controller";
import { AuthenticateMiddleware } from "../middleware";

const router = Router()

router.post('/create-new',AuthenticateMiddleware,AddNewCourse)
router.get('/get-all-courses',AuthenticateMiddleware,GetAllCourses)
router.post('/create-section/:id',AuthenticateMiddleware,CreateSection)
router.get('/get-all-sections/:id',AuthenticateMiddleware,GetAllSections)

export default router