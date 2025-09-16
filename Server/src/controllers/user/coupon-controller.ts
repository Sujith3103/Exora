import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";


const isValidDate = (validFrom: Date, validUntil: Date): boolean => {
    const validFromDate = new Date(validFrom);
    const validUntilDate = new Date(validUntil);
    if (validFromDate.getTime() > Date.now()) {
        return true;
    }
    if (validUntilDate.getTime() <= Date.now()) {
        return true;
    }

    return false;
};

const isMaxCouponLimitReached = (couponLimit: number, couponsUsed: number): boolean => {
    return couponsUsed >= couponLimit;
}

const isLimitPerUser = async (couponId: string, limitPerUser: number, userId: string | undefined): Promise<boolean> => {

    const isAuthticated = Boolean(userId)
    try {

        if (!isAuthticated) {
            return false
        }

        const res = await prisma.couponApplication.findMany({
            where: { id: couponId, userId: userId, status: 'REDEEMED' }
        })

        if (res.length >= limitPerUser) {
            return true
        }

        else {
            await prisma.couponApplication.create({
                data: {
                    couponId: couponId,
                    userId: userId!,
                    status: 'APPLIED'
                }
            })
            return false
        }

    } catch (err) {
        return true
    }

}

const isCourseType = (item: any, courseId: string) => {
    if (item.applyTo === 'allCourses') {
        return false
    }
    else {
        if (item.courseId === courseId) {
            return false
        }
        else {
            return true
        }
    }

}

const checkTier = async (item: any, userId: string | undefined) => {
    const isAuthenticated = Boolean(userId)

    if (!isAuthenticated) {
        return false
    }

    try {

        const res = await prisma.couponApplication.findMany({
            where: {
                couponId: item.id,
                status: "REDEEMED",
                userId: userId
            }
        })
        

        if (item.onlyFor === 'tier_3') {
            return false
        }

        else if (res.length === 0 && item.onlyFor === 'tier_1') {
            return false
        }
        // else if (res.length > 0 && item.onlyFor !== 'tier_2') {
        //     console.log("not tier 2")
        //     return false
        // }

        else {
            return false
        }

    } catch (err) {
        return true
    }
}

export const valideateCouponOnLogin = async (req: Request, res: Response) => {

    const { courseId, instructorId, userId, isAuthenticated } = req.body

    try {
        const coupons = await prisma.coupon.findMany({
            where: {
                userId: instructorId
            }
        })
        let found = false

        for (let item of coupons) {

            if (found) break

            else if (item.autoApply && !isValidDate(item.validFrom, item.validUntil)
                && !isCourseType(item, courseId) && !isMaxCouponLimitReached(item.noOfCoupons, item.timesUsed)
                && !(await isLimitPerUser(item.id, item.limitPerUser, userId)) && !(await checkTier(item, userId))
            ) {
                found = true
                return res.status(200).json({
                    success: true,
                    data: item
                })

            }
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message:"failed to fetch coupons"
        })
    }

}

export const validateCoupon = async (req: Request, res: Response) => {

    const { courseId, coupon, instructorId, userId, isAuthenticated } = req.body

    try {
        const coupons = await prisma.coupon.findMany({
            where: {
                userId: instructorId,
                code: coupon
            }
        })

        if (coupons.length === 0) {
            return res.json({
                success: false,
                message: 'Coupon not found'
            })
        }

        for (let item of coupons) {

            if (isValidDate(item.validFrom, item.validUntil)) {
                return res.json({
                    success: false,
                    message: 'Coupon is expired or not active yet'
                })
            }

            else if (isMaxCouponLimitReached(item.noOfCoupons, item.timesUsed)) {
                return res.json({
                    success: false,
                    message: 'maximun coupon limit reached'
                })
            }

            else if (await isLimitPerUser(item.id, item.limitPerUser, userId)) {
                return res.json({
                    success: false,
                    message: 'maximum limit per user reached'
                })
            }

            else if (await isCourseType(item, courseId)) {
                return res.json({
                    success: false,
                    message: 'coupon not valid for this course'
                })
            }

            else {
                if (isAuthenticated) {
                    await prisma.couponApplication.create({
                        data: {
                            couponId: item.id,
                            userId: userId,
                            status: 'APPLIED',
                        }
                    })
                }
                return res.json({
                    success: true,
                    message: 'coupon is valid',
                    data: item
                })
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'failed to validate coupon'
        })
    }

}