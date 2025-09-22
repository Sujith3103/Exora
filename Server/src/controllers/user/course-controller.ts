import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { redis } from "../../utils/redisClient";
import { validateCouponCore } from "../../helpers/validateCoupon";
import { startOfMonth } from "date-fns";

const prisma = new PrismaClient()

export const student_GetAllCourses = async (req: Request, res: Response) => {
    try {
        const pageNum = Number(req.query.page) || 1;
        const limitNum = Number(req.query.limit) || 10;
        const category = req.query.category as string | undefined;

        const skip = (pageNum - 1) * limitNum;

        const where: any = { status: 'published' };
        if (category) {
            where.category = category; // filter by category if passed
        }
        const [courses, total] = await Promise.all([
            prisma.course.findMany({
                where,
                select: {
                    id: true, title: true, subtitle: true, category: true, thumbnailUrl: true, level: true,
                    pricing: true, primaryLanguage: true, slug: true,
                    instructor: { select: { id: true, name: true, email: true, } }
                },
                skip,
                take: limitNum,
                orderBy: { createdAt: 'desc' }, // optional
            }),
            prisma.course.count({ where }),
        ]);

        res.status(200).json({
            success: true,
            message: "fetched courses successfully",
            data: courses,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const student_GetCourseDetails = async (req: Request, res: Response) => {

    const { courseId } = req.params

    try {

        const details = await prisma.course.findFirst({
            where: { id: courseId },
            include: {
                instructor: {
                    select: { id: true, name: true, email: true, updatedAt: true, role: true, profile: { select: { profession: true } } }
                }
            }
        })

        if (!details) return res.status(404).json({ success: false, message: "course not found" })

        return res.status(200).json({
            success: true,
            message: "fetched course details successfully",
            data: details
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "failed to fetch course details"
        })
    }
}

export const purchaseCourse = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { courseId } = req.params;
    const { discountApplied, finalPrice, originalPrice, clickEvent, coupon } = req.body;
    const { type, action, targetId, categoryId, instructorId } = clickEvent;

    if (!userId) {
        return res.status(401).json({ success: false, message: "unauthorized" });
    }

    try {
        let couponData = null;

        if (coupon) {
            const result = await validateCouponCore({
                couponCode: coupon.code,
                courseId,
                instructorId,
                userId,
            });

            if (!result.valid) {
                return res.json({ success: false, message: result.reason });
            }
            couponData = result.coupon;
        }

        // // --- transaction ---
        await prisma.$transaction(async (tx) => {
            // 1. Create purchase
            const userPurchase = await tx.userPurchase.create({
                data: {
                    price: finalPrice,
                    courseId,
                    userId,
                },
            });

            // 2. If coupon was applied → mark as redeemed
            if (couponData) {
                const couponApplication = await tx.couponRedemption.create({
                    data: {
                        couponId: couponData.id,
                        userId,
                        status: "REDEEMED",
                        courseId: courseId
                    },
                });

                const updatedCoupon = await tx.coupon.update({
                    where: { id: couponData.id },
                    data: {
                        timesUsed: { increment: 1 },
                        totalRevenue: {
                            increment: finalPrice
                        }
                    },
                });

            }

            // 3. Add analytics event to Redis
            await redis.xAdd(
                "click-events-stream",
                "*",
                {
                    discountApplied: String(discountApplied ?? 0),
                    finalPrice: String(finalPrice),
                    originalPrice: String(originalPrice),
                    targetId: String(targetId),
                    type,
                    action,
                    categoryId: categoryId ?? "",
                    instructorId,
                    userId,
                },
                {
                    TRIM: { strategy: "MAXLEN", threshold: 100 },
                }
            );
        });

        return res.json({ success: true, message: "Purchase successful" });
    } catch (err) {
        console.error("purchaseCourse error:", err);
        return res.status(500).json({ success: false, message: "Purchase failed" });
    }
};
