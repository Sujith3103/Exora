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

    let today = new Date()

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
                await tx.couponRedemption.create({
                    data: {
                        couponId: couponData.id,
                        userId,
                        status: "REDEEMED",
                        courseId: courseId
                    },
                });

                await tx.coupon.update({
                    where: { id: couponData.id },
                    data: {
                        timesUsed: { increment: 1 },
                        totalRevenue: {
                            increment: finalPrice
                        }
                    },
                });

                await tx.couponApplication.upsert({
                    where: {
                        couponId_month_status: {
                            couponId: couponData.id,
                            month: startOfMonth(today),
                            status: 'REDEEMED'
                        }
                    },
                    create: {
                        month: startOfMonth(today),
                        couponId: couponData.id,
                        instructorId: instructorId,
                        status: 'REDEEMED',
                        appliedCount: 1,
                        revenue: finalPrice
                    },
                    update: {
                        appliedCount: {
                            increment: 1
                        },
                        revenue: {
                            increment: finalPrice
                        }
                    }
                })

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


/**
 * POST /api/progress/lecture/:lectureId/ping
 * body: { watchedSec: number, courseId: string }
 * Saves latest watched seconds (periodic)
 */
export const pingLecture = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const lectureId = req.params.lectureId;
        const { watchedSec = 0, courseId } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: "unauthorized" });
        }

        const upsert = await prisma.userLectureProgress.upsert({
            where: { userId_lectureId: { userId, lectureId } },
            create: {
                userId,
                lectureId,
                courseId,
                watchedSec,
                completed: false
            },
            update: { watchedSec, updatedAt: new Date() }
        });

        res.json({ ok: true, progress: upsert });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'ServerError' });
    }
};

/**
 * POST /api/progress/lecture/:lectureId/complete
 * body: { courseId: string }
 * Marks lecture completed. Then checks whether all lectures in course are completed;
 * if yes, marks CourseProgress.completed and returns courseCompleted: true.
 */
export const markLectureComplete = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const lectureId = req.params.lectureId;
        const { courseId } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: "unauthorized" });
        }

        // mark lecture completed
        await prisma.userLectureProgress.upsert({
            where: { userId_lectureId: { userId, lectureId } },
            create: {
                userId,
                lectureId,
                courseId,
                watchedSec: 0,
                completed: true
            },
            update: { completed: true, watchedSec: 0, updatedAt: new Date() }
        });

        // count total lectures in course
        const total = await prisma.lecture.count({
            where: { section: { courseId } } // lecture -> section -> course
        });

        // count completed lectures by this user in this course
        const completedCount = await prisma.userLectureProgress.count({
            where: { userId, courseId, completed: true }
        });

        let courseCompleted = false;

        if (total > 0 && completedCount >= total) {
            // mark course progress
            await prisma.courseProgress.upsert({
                where: { userId_courseId: { userId, courseId } },
                create: { userId, courseId, completed: true, completedAt: new Date() },
                update: { completed: true, completedAt: new Date() }
            });

            courseCompleted = true;
            // Optionally, update UserPurchase or send a congrats notification
        }

        res.json({ ok: true, courseCompleted, completedCount, total });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'ServerError' });
    }
};

/**
 * GET /api/progress/course/:courseId/status
 * returns progress summary for the current user
 */
export const returnStatus = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const courseId = req.params.courseId;


        if (!userId) {
            return res.status(401).json({ success: false, message: "unauthorized" });
        }

        const total = await prisma.lecture.count({
            where: { section: { courseId } }
        });

        const completedCount = await prisma.userLectureProgress.count({
            where: { userId, courseId, completed: true }
        });

        const nextIncomplete = await prisma.lecture.findFirst({
            where: {
                section: { courseId },
                NOT: {
                    id: {
                        in: (await prisma.userLectureProgress.findMany({
                            where: { userId, courseId, completed: true },
                            select: { lectureId: true }
                        })).map(p => p.lectureId)
                    }
                }
            },
            orderBy: { order: 'asc' }
        });

        res.json({ ok: true, total, completedCount, nextLecture: nextIncomplete });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'ServerError' });
    }
};

export const getLearn = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ success: false, message: "unauthorized" });
    }

    try {
        // 1. Fetch course with sections -> lectures -> lectureAssets, ordered
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: {
                id: true,
                title: true,
                description: true,
                thumbnailUrl: true,
                instructor: { select: { id: true, name: true } },
                sections: {
                    orderBy: { order: 'asc' },
                    select: {
                        id: true,
                        title: true,
                        order: true,
                        lectures: {
                            orderBy: { order: 'asc' },
                            select: {
                                id: true,
                                title: true,
                                order: true,
                                freePreview: true,
                                lectureAssets: {
                                    select: {
                                        id: true,
                                        url: true,
                                        type: true,
                                        thumbnailUrl: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!course) return res.status(404).json({ error: 'Course not found' });

        // 2. Flatten lecture IDs to query progress in one shot
        const lectureIds = [];
        for (const section of course.sections) {
            for (const lecture of section.lectures) {
                lectureIds.push(lecture.id);
            }
        }

        // 3. Fetch user's progress rows for this course (single query)
        const progressRows = await prisma.userLectureProgress.findMany({
            where: {
                userId,
                courseId
            },
            select: {
                lectureId: true,
                watchedSec: true,
                completed: true
            }
        });

        const progByLecture = new Map();
        for (const r of progressRows) progByLecture.set(r.lectureId, { watchedSec: r.watchedSec, completed: r.completed });

        // 4. Annotate lectures with progress flags and compute totals
        let totalLectures = 0;
        let completedLectures = 0;

        const sectionsWithProgress = course.sections.map((section) => {
            const lectures = section.lectures.map((lec) => {
                totalLectures++;
                const p = progByLecture.get(lec.id) || { watchedSec: 0, completed: false };
                if (p.completed) completedLectures++;
                return {
                    id: lec.id,
                    title: lec.title,
                    order: lec.order,
                    freePreview: lec.freePreview,
                    lectureAssets: lec.lectureAssets ? {
                        id: lec.lectureAssets.id,
                        url: lec.lectureAssets.url,
                        type: lec.lectureAssets.type,
                        thumbnailUrl: lec.lectureAssets.thumbnailUrl
                    } : null,
                    progress: {
                        watchedSec: p.watchedSec ?? 0,
                        completed: !!p.completed
                    }
                };
            });

            return {
                id: section.id,
                title: section.title,
                order: section.order,
                lectures
            };
        });

        // 5. Determine nextLectureId (first not completed in course order)
        let nextLectureId = null;
        outer: for (const section of sectionsWithProgress) {
            for (const lec of section.lectures) {
                if (!lec.progress.completed) {
                    nextLectureId = lec.id;
                    break outer;
                }
            }
        }

        const percentage = totalLectures === 0 ? 0 : Math.round((completedLectures / totalLectures) * 100);

        // 6. Build response payload
        const payload = {
            course: {
                id: course.id,
                title: course.title,
                description: course.description,
                thumbnailUrl: course.thumbnailUrl,
                instructor: course.instructor,
                sections: sectionsWithProgress
            },
            progress: {
                totalLectures,
                completedLectures,
                percentage
            },
            nextLectureId
        };

        return res.json(payload);
    } catch (err) {
        console.error('Error in /course/:courseId/learn', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

export const getPopularCourses = async (req: Request, res: Response) => {
    try {
        const result = await prisma.courseRevenueAnalytics.findMany({
            take: 6,
            orderBy: {
                totalEnrolls:'desc'
            },
            select: {
                course:true
            },
        });

        // aggregate enrollments in JS

        // sort manually by enrollment count

        return res.status(200).json({
            success: true,
            message: "Fetched top 6 popular courses",
            data: result,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to get popular courses",
        });
    }
};
