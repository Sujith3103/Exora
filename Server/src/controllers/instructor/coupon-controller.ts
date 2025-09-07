import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import { success } from "zod";

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
    applyTo: 'oneCourse' | 'allCourses',
    courseId?: string
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