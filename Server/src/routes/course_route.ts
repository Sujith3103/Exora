import { Router } from "express";
import { AddNewCourse, GetAllCourses } from "../controllers/course-controller";
import { AuthenticateMiddleware } from "../middleware";

const router = Router()

router.post('/create-new',AuthenticateMiddleware,AddNewCourse)
router.get('/get-all-courses',AuthenticateMiddleware,GetAllCourses)

export default router