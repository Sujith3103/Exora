import pMap from "p-map";
import { redis } from "../utils/redisClient";
import { ClickEvent } from "../config";
import { prisma } from "../utils/prisma";

type RedisStreamMessage = {
    id: string;
    message: Record<string, string>;
};

type RedisStreamResponse = {
    name: string;
    messages: RedisStreamMessage[];
}[];

const BATCH_SIZE = 10;
const BLOCK_MS = 5000;
const CONCURRENCY = 5;

let isRunning = true;

// Graceful shutdown
process.on("SIGINT", () => { console.log("Shutting down consumer..."); isRunning = false; });
process.on("SIGTERM", () => { console.log("Shutting down consumer..."); isRunning = false; });


function parseClickEvent(record: RedisStreamMessage): ClickEvent {
    const raw = record.message;

    let metadata: ClickEvent["metadata"];
    try {
        metadata = raw.metadata ? JSON.parse(raw.metadata) : undefined;
    } catch (e) {
        console.warn("Invalid metadata JSON, ignoring:", raw.metadata);
        metadata = undefined;
    }

    return {
        userId: raw.userId,
        type: raw.type as ClickEvent["type"],
        targetId: raw.targetId,
        categoryId: raw.categoryId,
        categoryName: raw.categoryName,
        instructorId: raw.instructorId,
        action: (raw.action as ClickEvent["action"]) || "click",
        timestamp: raw.timestamp || new Date().toISOString(),
        metadata,
    };
}


export const processAnalyticsEvent = async () => {

    console.log("analytics event started")


    while (isRunning) {
        try {

            const response = await redis.xReadGroup(
                'analytics-consumer-group',
                'analytics-consumer-1',
                [{ key: "click-events-stream", id: ">" }],
                { COUNT: BATCH_SIZE, BLOCK: BLOCK_MS }
            )
            if (!Array.isArray(response) || response.length === 0) continue;

            const streams = response as RedisStreamResponse;
            for (const streamData of streams) {
                await pMap(streamData.messages, async (record: any) => {
                    const clickEvent = parseClickEvent(record)
                    
                    if (clickEvent.type === 'category') {
                        await redis.xAck("click-events-stream", "analytics-consumer-group", record.id);
                        return;
                    }

                    if (clickEvent.action === 'click') {
                        await prisma.$transaction(async (tx: any) => {

                            const courseExists = await tx.course.findUnique({
                                where: { id: clickEvent.targetId }
                            });

                            if (!courseExists) {
                                console.warn(`Skipping analytics for unknown courseId ${clickEvent.targetId}`);
                                return;
                            }

                            await tx.courseAnalytics.upsert({
                                where: { courseId: clickEvent.targetId },
                                update: {
                                    clicks: {
                                        increment: 1
                                    },

                                },
                                create: {
                                    courseId: clickEvent.targetId,
                                    clicks: 1
                                }
                            })

                            await redis.xAck("click-events-stream", "analytics-consumer-group", record.id);

                            console.log("Processed analytics:", clickEvent);
                        }, {
                            timeout: 15000,  // 15 seconds
                            maxWait: 5000    // optional: how long to wait for connection
                        })

                    }

                    else if(clickEvent.action === 'enroll'){

                    }

                })
            }

        } catch (err) {
            console.error("Redis read error:", err);
        }

    }

}