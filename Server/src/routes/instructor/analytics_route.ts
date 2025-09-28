import { Router } from "express";
import { AuthenticateMiddleware } from "../../middleware";
import { getEnrollmentsTimeSeries, getRevenueAndSalesAnalytics,  getRevenueTimeSeries } from "../../controllers/instructor/analytics-controller";

const router = Router()


router.get('/revenue-and-sales',AuthenticateMiddleware,getRevenueAndSalesAnalytics)
router.get('/revenue/timeseries',AuthenticateMiddleware,getRevenueTimeSeries)
router.get('/enrollments/timeseries',AuthenticateMiddleware,getEnrollmentsTimeSeries)

export default router