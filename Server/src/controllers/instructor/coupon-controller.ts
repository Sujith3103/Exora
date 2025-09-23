import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import { success } from "zod";
import { addMonths, startOfMonth, subMonths } from "date-fns";

export type couponForm = {
    title: string,
    code: string,
    discountType: "percentage" | "fixed",
    discount: number,
    noOfCoupons: number,
    limitPerUser: number,
    onlyFor: 'tier_3' | 'tier_1' | 'tier_2',
    autoApply: boolean,
    validUntil: Date,
    validFrom: Date,
    timesApplied: number,
    applyTo: 'oneCourse' | 'allCourses',
    courseId?: string
}
type ConversionRates = {
    thisMonth: number;  // in percentage
    lastMonth: number;  // in percentage
};

function calculateCouponConversion(
    timesAppliedThisMonth: number,
    timesRedeemedThisMonth: number,
    timesAppliedLastMonth: number,
    timesRedeemedLastMonth: number
): ConversionRates {
    const calcRate = (applied: number, redeemed: number) => {
        if (applied === 0) return 0; // avoid division by zero
        return (redeemed / applied) * 100;
    };

    return {
        thisMonth: parseFloat(calcRate(timesAppliedThisMonth, timesRedeemedThisMonth).toFixed(2)),
        lastMonth: parseFloat(calcRate(timesAppliedLastMonth, timesRedeemedLastMonth).toFixed(2)),
    };
}

export const createNewCoupon = async (req: Request, res: Response) => {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" })

    const coupon: couponForm = req.body
    try {
        const result = await prisma.coupon.create({
            data: {
                applyTo: coupon.applyTo,
                code: coupon.code,
                autoApply: coupon.autoApply,
                discount: Number(coupon.discount), // ✅ convert string → number
                discountType: coupon.discountType,
                limitPerUser: Number(coupon.limitPerUser), // ✅
                noOfCoupons: Number(coupon.noOfCoupons),   // ✅
                onlyFor: coupon.onlyFor,
                title: coupon.title,
                totalRevenue: 0,
                validUntil: new Date(coupon.validUntil),   // ✅ convert to Date
                userId: userId,
                courseId: coupon.courseId ? coupon.courseId : '',         // ✅ optional
            }
        })

        return res.status(200).json({
            success: true,
            message: "created a coupon successfully",
            data: result
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "failed to create a new coupon"
        })
    }
}

export const getAllCoupons = async (req: Request, res: Response) => {

    const userId = req.user?.id
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" })

    try {

        const result = await prisma.coupon.findMany({
            where: { userId: userId }
        })

        return res.status(200).json({
            success: true,
            message: 'fetched all coupons',
            data: result
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "failed to fetch coupons"
        })
    }
}

export const editCoupon = async (req: Request, res: Response) => {
    const couponId = req.params.couponId;
    const coupon = req.body;
    const userId = req.user?.id;

    try {
        await prisma.coupon.update({
            where: { id: couponId },
            data: {
                ...coupon,
                validFrom: new Date(coupon.validFrom),   // ✅ ensures correct Date type
                validUntil: new Date(coupon.validUntil), // ✅
            },
        })

        return res.status(200).json({
            success: true,
            message: "Updated the coupon",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to edit coupon",
        });
    }
};


export const deleteCoupon = async (req: Request, res: Response) => {

    const userId = req.user?.id
    const couponId = req.params.couponId

    try {

        const result = await prisma.coupon.delete({
            where: { id: String(couponId), userId: userId }
        })

        return res.status(200).json({
            success: true,
            message: "deleted the coupon successfully"
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "failed to delete coupon"
        })
    }

}
export const getCouponAnalytics = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    // Get IST time (UTC + 5:30)
    const nowUTC = new Date();
    const nowIST = new Date(nowUTC.getTime() + (5.5 * 60 * 60 * 1000));

    // IST month boundaries
    const prevMonthStart = new Date(nowIST.getFullYear(), nowIST.getMonth() - 1, 1);
    const currMonthStart = new Date(nowIST.getFullYear(), nowIST.getMonth(), 1);
    const nextMonthStart = new Date(nowIST.getFullYear(), nowIST.getMonth() + 1, 1);

    const rangeStart = prevMonthStart;
    const rangeEnd = nextMonthStart;

    let timesAppliedThisMonth = 0;
    let timesAppliedPrevMonth = 0;
    let revenueThisMonth = 0;
    let revenueLastMonth = 0;
    let totalRevenue = 0;
    let conversionRateThisMonth = 0;
    let conversionRateLastMonth = 0;

    try {
        // Run all queries in a single transaction
        const [applications, result, totalRevenueResult, history] = await prisma.$transaction([
            prisma.couponApplication.findMany({
                where: {
                    instructorId: userId,
                    month: { gte: rangeStart, lt: rangeEnd },
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
                    month: { gte: rangeStart, lt: rangeEnd },
                    status: 'REDEEMED'
                }
            })
        ]);

        totalRevenue = totalRevenueResult._sum?.totalRevenue ?? 0;

        // Calculate revenue per month using IST month/year comparison
        for (let item of history) {
            const monthIST = new Date(item.month.getTime() + (5.5 * 60 * 60 * 1000));

            if (monthIST.getMonth() === prevMonthStart.getMonth() && monthIST.getFullYear() === prevMonthStart.getFullYear()) {
                revenueLastMonth += item.revenue;
            }

            if (monthIST.getMonth() === currMonthStart.getMonth() && monthIST.getFullYear() === currMonthStart.getFullYear()) {
                revenueThisMonth += item.revenue;
            }
        }

        const totalTimesApplied = result._sum.timesApplied ?? 0;

        // Count applications & redeemed per month (IST comparison)
        for (let item of applications) {
            const monthIST = new Date(item.month.getTime() + (5.5 * 60 * 60 * 1000));

            if (monthIST.getMonth() === prevMonthStart.getMonth() && monthIST.getFullYear() === prevMonthStart.getFullYear()) {
                if (item.status === 'APPLIED') timesAppliedPrevMonth += item.appliedCount;
                else if (item.status === 'REDEEMED') conversionRateLastMonth += item.appliedCount;
            }

            if (monthIST.getMonth() === currMonthStart.getMonth() && monthIST.getFullYear() === currMonthStart.getFullYear()) {
                if (item.status === 'APPLIED') timesAppliedThisMonth += item.appliedCount;
                else if (item.status === 'REDEEMED') conversionRateThisMonth += item.appliedCount;
            }
        }

        // Calculate conversion rates
        const convertedValue = calculateCouponConversion(
            timesAppliedThisMonth,
            conversionRateThisMonth,
            timesAppliedPrevMonth,
            conversionRateLastMonth
        );
        conversionRateLastMonth = convertedValue.lastMonth;
        conversionRateThisMonth = convertedValue.thisMonth;

        res.status(200).json({
            success: true,
            message: "fetched coupon analytics successfully",
            data: {
                totalTimesApplied,
                timesAppliedThisMonth,
                timesAppliedPrevMonth,
                revenueThisMonth,
                revenueLastMonth,
                conversionRateLastMonth,
                conversionRateThisMonth,
                totalRevenue
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
