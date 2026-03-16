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

/** --- IST Helpers --- */
function getISTMidnight(date: Date = new Date()): Date {
    const istOffset = 330; // +5:30
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const istDate = new Date(utc + istOffset * 60000);
    istDate.setHours(0, 0, 0, 0);
    return istDate;
}

function nowIST(): string {
    const istOffset = 330; // +5:30
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utc + istOffset * 60000);
    return istTime.toISOString();
}

/** --- Parse Click Event --- */
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
        discountApplied: parseInt(raw.discountApplied),
        originalPrice: parseInt(raw.originalPrice),
        finalPrice: parseInt(raw.finalPrice),
        action: (raw.action as ClickEvent["action"]) || "click",
        timestamp: raw.timestamp || nowIST(),   // ✅ IST timestamp
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
                    console.log("record : ", record)

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
                                update: { clicks: { increment: 1 } },
                                create: { courseId: clickEvent.targetId, clicks: 1 }
                            })

                            console.log("Processed analytics:", clickEvent);
                        }, {
                            timeout: 15000,
                            maxWait: 5000
                        })
                    }

                    else if (clickEvent.action === 'enroll') {
                        const today = getISTMidnight();   // ✅ IST midnight

                        await prisma.$transaction(async (tx:any) => {
                            const revenueAnalytics = await tx.courseRevenueAnalytics.upsert({
                                where: { courseId: clickEvent.targetId },
                                update: {
                                    totalDiscountedRevenue: {
                                        increment: clickEvent.discountApplied ? clickEvent.finalPrice : 0
                                    },
                                    totalEnrolls: { increment: 1 },
                                    totalRevenue: { increment: clickEvent.finalPrice }
                                },
                                create: {
                                    instructorId: clickEvent.instructorId!,
                                    courseId: clickEvent.targetId,
                                    totalDiscountedRevenue: clickEvent.discountApplied ? clickEvent.finalPrice : 0,
                                    totalEnrolls: 1,
                                    totalRevenue: clickEvent.finalPrice
                                }
                            })

                            const revenueHistory = await tx.courseRevenueHistory.upsert({
                                where: {
                                    courseId_date: {
                                        courseId: clickEvent.targetId,
                                        date: today,
                                    },
                                }, update: {
                                    enrollments: { increment: 1 },
                                    revenue: { increment: clickEvent.finalPrice },
                                    dicountedRevenue: {
                                        increment: clickEvent.discountApplied ? clickEvent.finalPrice : 0
                                    }
                                },
                                create: {
                                    date: today,
                                    instructorId: clickEvent.instructorId!,
                                    courseId: clickEvent.targetId,
                                    dicountedRevenue: clickEvent.discountApplied ? clickEvent.finalPrice : 0,
                                    revenue: clickEvent.finalPrice,
                                    enrollments: 1
                                }
                            })
                        })
                    }

                    await redis.xAck("click-events-stream", "analytics-consumer-group", record.id);
                })
            }
        } catch (err) {
            console.error("Redis read error:", err);
        }
    }
}
