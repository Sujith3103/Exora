import { Request, Response, Router } from "express";
import { array, z } from "zod";
import { ClickEvent } from "../config";
import { redis } from "../utils/redisClient";

import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import { prisma } from "../utils/prisma";
dayjs.extend(utc);

const router = Router();

const DEDUP_KEY = "dedup:clicks";

const clickSchema = z.object({
    userId: z.string().min(1, "userId is required"),
    type: z.enum(["course", "category", "instructor"]),
    targetId: z.string().min(1, "targetId is required"),
    categoryId: z.string().optional(),
    instructorId: z.string().optional(),
    action: z.enum(["click", "view", "enroll", "share"]).default("click"),
    sessionId: z.string().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
});

router.post("", async (req: Request, res: Response) => {
    try {
        // ✅ validate with Zod
        const parsed = clickSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: parsed.error.message });
        }

        const { userId, type, targetId, categoryId, instructorId, action, sessionId, metadata, } = parsed.data;

        const clickEvent: ClickEvent = {
            userId,
            type,
            targetId,
            categoryId,
            instructorId,
            action,
            timestamp: new Date().toISOString(),
            metadata: {
                ...metadata,
                sessionId,
                device: req.headers["user-agent"] || "",
            },
        };

        const result = await redis.xAdd("click-events-stream", "*", {
            userId,
            type,
            targetId,
            categoryId: categoryId || "",
            instructorId: instructorId || "",
            action,
            sessionId: sessionId || "",
            metadata: metadata ? JSON.stringify(metadata) : "",
            timestamp: new Date().toISOString(),
            device: req.headers["user-agent"] || "",
        }, {
            TRIM: {
                strategy: 'MAXLEN',
                threshold: 100,
            }
        });

        console.log(result)

        // await enqueueClickEvent(clickEvent);

        return res.status(200).json({ message: "Click tracked" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

router.get("/trending/:categoryId", async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    let hourBucket = parseInt(dayjs().utc().format("YYYYMMDDHH"))

    const bucketsToCheck = 6;

    const courseScoreMap = new Map<string, number>();

    for (let i = 0; i < bucketsToCheck; i++) {
        const bucketKey = `trending:category:${categoryId}:${hourBucket as unknown as string}`;

        const rawTop = (await redis.sendCommand([
            "ZREVRANGE",
            bucketKey,
            "0",
            "5",
            "WITHSCORES"
        ])) as string[];

        // console.log(rawTop)
        if (rawTop && rawTop.length > 0) {
            for (let j = 0; j < rawTop.length; j += 2) {
                const courseId = rawTop[j].split(":")[1];
                const score = Number(rawTop[j + 1]);

                courseScoreMap.set(courseId, (courseScoreMap.get(courseId) || 0) + score);
            }
        }

        hourBucket--;
    }

    console.log(courseScoreMap)
    const courseScores = Array.from(courseScoreMap.entries())
        .map(([courseId, score]) => ({ courseId, score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    res.status(200).json({
        success: true,
        categoryId,
        courseScores,
    });
});

function scoreCourse(course: any, categoryPref: any, instructorPref: any) {
    const catScore = categoryPref.get(course.category) ?? 0;
    const instScore = instructorPref.get(course.instructorId) ?? 0;

    // popularity normalization (example: log scale)
    const clicks =  course.CourseAnalytics?.clicks?course.CourseAnalytics.clicks : 0
    const popularity = Math.log(1 + clicks)

    // freshness (0..1 based on createdAt)
    const daysOld = (Date.now() - new Date(course.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    const freshness = Math.exp(-0.01 * daysOld);

    // weighted sum
    return (
        0.5 * catScore +
        0.3 * instScore +
        0.15 * popularity +
        0.05 * freshness
    );
}


router.get("/for-you/:userId", async (req: Request, res: Response) => {

    const { userId } = req.params

    const limit = 10
    const days = 7
    const sinceISO = dayjs().subtract(days, "day").toISOString();

    const clicks = await prisma.userClick.findMany({
        where: {
            userId,
            timestamp: { gte: new Date(sinceISO) },
            // clickType: "course"
        },
        select: {
            categoryId: true,
            instructorId: true,
            action: true,
            timestamp: true,
            targetId: true,
        },
        orderBy: { timestamp: "desc" },
        take: 500, // safety cap
    })
    if(clicks.length === 0) return res.json("nothing")
    const seenCourseIds = new Set<string>();
    for (const c of clicks) {
        // if data landed as targetId for course clicks, capture that too
        if (c.targetId) {
            seenCourseIds.add(c.targetId);
            // console.log(seenCourseIds)
        }
    }
    if (clicks.length <= 0) return

    const ActionWeight: Record<string, number> = {
        view: 0.5,
        click: 1.0,
        share: 1.2,
        enroll: 2.0,
    }

    const HALF_LIFE_DAYS = 7
    const lamda = Math.log(2) / HALF_LIFE_DAYS

    const categoryPref = new Map<string, number>();
    const instructorPref = new Map<string, number>();

    for (const ev of clicks) {
        const action = (ev.action ?? 'click').toLowerCase()
        const basew = ActionWeight[action] ?? 1.0
        const ageDays = Math.max(
            0,
            (Date.now() - new Date(ev.timestamp).getTime()) / (1000 * 60 * 60 * 24)
        );

        //freshness of the event
        const recency = Math.exp(-lamda * ageDays)
        const weight = recency * basew
        if (ev.categoryId) {
            categoryPref.set(ev.categoryId, (categoryPref.get(ev.categoryId) ?? 0) + weight);
        }
        if (ev.instructorId) {
            instructorPref.set(ev.instructorId, (instructorPref.get(ev.instructorId) ?? 0) + weight);
        }
    }

    function normalize(m: Map<string, number>) {
        let max = 0;
        for (const v of m.values()) max = Math.max(max, v);
        if (max === 0) return;
        for (const [k, v] of m.entries()) m.set(k, v / max);
    }
    normalize(categoryPref);
    normalize(instructorPref);

    const interestedCategories = Array.from(categoryPref.keys());
    const interestedInstructors = Array.from(instructorPref.keys());

    const candidates = await prisma.course.findMany({
        where: {
            status: "published",
            // id: { notIn: Array.from(seenCourseIds) }, // exclude already seen
            category: {
                in: interestedCategories, // restrict to categories user interacted with
            },    
        },
        select: {
            id:true,
            category:true,
            createdAt:true,
            title:true,
            instructorId:true,
            instructor: {select:{id:true,name:true}},
            CourseAnalytics: true, // so you can use popularity/trending scores
        },
        take: 1000, // cap so you don't overload memory
    });

    const scored = candidates.map(c => ({
        course: c,
        score: scoreCourse(c, categoryPref, instructorPref)
    }));

    scored.sort((a, b) => b.score - a.score);

    const recommendations = scored.slice(0, 5).map(s => s.course);

    console.log(recommendations.length)
    console.log(candidates.length)

    return res.status(200).json({
        // clicks,
        //  courses
        recommendations
    })

})

router.get("/for-you/:userId/delete",async (req: Request, res: Response) => { 

    const {userId} = req.params

    const result = await prisma.userClick.deleteMany({
        where:{userId:userId}
    })

    res.json({result})
})
export default router;
