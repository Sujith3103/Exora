import { Request, Response, Router } from "express";
import { z } from "zod";
import { ClickEvent } from "../config";
import { redis } from "../utils/redisClient";

import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
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
        success:true,
        categoryId,
        courseScores,
    });
});

export default router;
