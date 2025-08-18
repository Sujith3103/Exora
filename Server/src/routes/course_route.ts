import { Router } from "express";
import { AddNewCourse } from "../controllers/course-controller";
import { AuthenticateMiddleware } from "../middleware";

const router = Router()

router.post('/create-new',AuthenticateMiddleware,AddNewCourse)

export default router