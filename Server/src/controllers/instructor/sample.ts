import { addMonths, startOfMonth, subMonths } from "date-fns";
import { prisma } from "../../utils/prisma";

export const getCouponAnalytics = async (req: Request, res: Response) => {
    const userId = 'somt';
    console.log("this ",new Date() )
    // first day of previous month
    const prevMonthStart = startOfMonth(subMonths(new Date(), 1)); // Aug 1
    const currMonthStart = startOfMonth(new Date());
    const nextMonthStart = startOfMonth(addMonths(new Date(), 1)); // Oct 1

    const rangeStart = prevMonthStart;   // Aug 1
    const rangeEnd = nextMonthStart;     // Oct 1
    let timesAppliedThisMonth = 0;
    let timesAppliedPrevMonth = 0;

    let revenueThisMonth = 0;
    let revenueLastMonth = 0;
    let totalRevenue = 0;

    let conversionRateThisMonth = 0;
    let conversionRateLastMonth = 0;

    try {
        const [applications, result, totalRevenueResult, history] = await prisma.$transaction([
            prisma.couponApplication.findMany({
                where: {
                    instructorId: userId,
                    month: {
                        gte: rangeStart,
                        lt: rangeEnd
                    }
                },
                include: { coupon: true }
            }),
            prisma.coupon.aggregate({
                where: { userId: userId },
                _sum: { timesApplied: true }
            }),
            prisma.coupon.aggregate({
                where: { userId: userId },
                _sum: { totalRevenue: true }
            }),
            prisma.couponApplication.findMany({
                where: {
                    instructorId: userId,
                    month: {
                        gte: rangeStart,
                        lt: rangeEnd
                    },
                    status: 'REDEEMED'
                }
            })
        ]);

        totalRevenue = totalRevenueResult._sum?.totalRevenue ?? 0;

        for (let item of history) {
            if (item.month.getTime() === prevMonthStart.getTime()) {
                revenueLastMonth += item.revenue;
            }
            if (item.month.getTime() === currMonthStart.getTime()) {
                revenueThisMonth += item.revenue;
            }
        }

        const totalTimesApplied = result._sum.timesApplied ?? 0;

        for (let item of applications) {
            if (item.month.getTime() === prevMonthStart.getTime()) {
                if (item.status === 'APPLIED') {
                    timesAppliedPrevMonth += item.appliedCount;
                } else if (item.status === 'REDEEMED') {
                    conversionRateLastMonth += item.appliedCount;
                }
            }

            if (item.month.getTime() === currMonthStart.getTime()) {
                if (item.status === 'APPLIED') {
                    timesAppliedThisMonth += item.appliedCount;
                } else if (item.status === 'REDEEMED') {
                    conversionRateThisMonth += item.appliedCount;
                }
            }
        }

        // const convertedValue = calculateCouponConversion(
        //     timesAppliedThisMonth,
        //     conversionRateThisMonth,
        //     timesAppliedPrevMonth,
        //     conversionRateLastMonth
        // );
        // conversionRateLastMonth = convertedValue.lastMonth;
        // conversionRateThisMonth = convertedValue.thisMonth;

        // res.status(200).json({
        //     success: true,
        //     message: "fetched coupon analytics successfully",
        //     data: {
        //         totalTimesApplied,
        //         timesAppliedThisMonth,
        //         timesAppliedPrevMonth,
        //         revenueThisMonth,
        //         revenueLastMonth,
        //         conversionRateLastMonth,
        //         conversionRateThisMonth,
        //         totalRevenue
        //     }
        // });
    } catch (err) {
        console.error(err);
        // res.status(500).json({ error: "Something went wrong" });
    }
};
