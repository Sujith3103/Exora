import { Router } from "express";
import { AuthenticateMiddleware } from "../../middleware";
import { getEnrollmentsTimeSeries, getRevenueAndSalesAnalytics,  getRevenueTimeSeries } from "../../controllers/instructor/analytics-controller";
import { rateLimitMiddleWare } from "../../middleware/rateLimit";

const router = Router()


router.get('/revenue-and-sales',AuthenticateMiddleware, rateLimitMiddleWare(),getRevenueAndSalesAnalytics)
router.get('/revenue/timeseries',AuthenticateMiddleware, rateLimitMiddleWare(),getRevenueTimeSeries)
router.get('/enrollments/timeseries',AuthenticateMiddleware, rateLimitMiddleWare(),getEnrollmentsTimeSeries)

export default router