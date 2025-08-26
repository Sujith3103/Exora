import { Request, Response, Router } from "express";
import { z } from "zod";
import { ClickEvent } from "../config";
import { redis } from "../utils/redisClient";

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

router.get('/trending',async(req:Request,res:Response) => {
    console.log("yes")
    const result = await redis.zRange(`trending:category:web-development`,0 ,9)
    console.log(result)

})

export default router;
