import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import { startOfMonth } from "date-fns";
import { success } from "zod";


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
    const month = startOfMonth(new Date())

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

        if (coupons.length === 0) {
            return res.json({
                success: false,
                message: 'no coupons'
            })
        }

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

        if (!found) {
            return res.json({
                success: false
            })
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "failed to fetch coupons"
        })
    }

}

export const validateCoupon = async (req: Request, res: Response) => {

    const { courseId, coupon, instructorId, userId, isAuthenticated } = req.body
    const month = startOfMonth(new Date())

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

            else if (isCourseType(item, courseId)) {
                return res.json({
                    success: false,
                    message: 'coupon not valid for this course'
                })
            }

            else {
                if (isAuthenticated) {

                    await prisma.$transaction(async (tx) => {

                        const inserting = await tx.couponApplication.upsert({
                            where: {
                                couponId_month: {
                                    couponId: item.id,
                                    month: month
                                }
                            },
                            update: {
                                appliedCount: {
                                    increment: 1
                                }
                            },
                            create: {
                                couponId: item.id,
                                instructorId: instructorId,
                                status: 'APPLIED',
                                month: month,
                                appliedCount:1
                            }
                        })

                        await tx.coupon.update({
                            where: { userId:instructorId, id: item.id },
                            data: {
                                timesApplied: {
                                    increment: 1
                                }
                            }
                        })
                    })
                }
                return res.json({
                    success: true,
                    message: 'coupon is applied',
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