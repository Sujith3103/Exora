import { Request, Response, Router } from "express";
import { stream } from "../utils/redisClient";
import { z } from "zod";

const router = Router();

// {
//   userId: "u123",
//   type: "course/category/instructor",         // primary object clicked
//   targetId: "c456",       // course id
//   categoryId: "cat789",   // course belongs to this category
//   instructorId: "i101",   // course belongs to this instructor
//   action: "view",
//   timestamp: "2025-08-25T10:00:00.000Z"
// }

// Zod schema for validation
const clickSchema = z.object({
    userId: z.string().min(1, "userId is required"),
    type: z.enum(["course", "category", "instructor"]),
    targetId: z.string().min(1, "targetId is required"),
    categoryId: z.string().optional(),    // related category
    instructorId: z.string().optional(),  // related instructor
    action: z.enum(["click", "view", "enroll", "share"]).default("click"),
    sessionId: z.string().optional(),
    metadata: z.record(z.string(), z.any()).optional()
});

router.post("", async (req: Request, res: Response) => {
    try {
        // Validate request body
        const parsed = clickSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({ message: parsed.error.message });
        }
        const {
            userId,
            type,
            targetId,
            categoryId,
            instructorId,
            action,
            sessionId,
            metadata,
        } = parsed.data;

        console.log("click event:",userId,type,targetId,categoryId,action)

        // await stream.xAdd("user-clicks", "*", {
        //     userId,
        //     type,
        //     targetId,
        //     categoryId: categoryId || "",
        //     instructorId: instructorId || "",
        //     action,
        //     sessionId: sessionId || "",
        //     metadata: metadata ? JSON.stringify(metadata) : "",
        //     timestamp: new Date().toISOString(),
        //     device: req.headers["user-agent"] || "",
        // }, { MAXLEN: 100000 });

        return res.status(200).json({ message: "Click tracked" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

export default router;
