import { retryConsumerClient, streamReader } from "../utils/redisClient";

let isRunning = true

process.on("SIGINT", () => { console.log("Shutting down consumer..."); isRunning = false; });
process.on("SIGTERM", () => { console.log("Shutting down consumer..."); isRunning = false; });


export const processMessageRetryConsumer = async () => {

    while (isRunning) {
        const now = Date.now()
        const jobs = await streamReader.zRangeByScore(
            "retry:zset",
            0,
            now,
            // offset: 0 → don’t skip anything, start from the first matching item.
            { LIMIT: { offset: 0, count: 10 } }
        )

        if (jobs.length === 0) {
            await new Promise(res => setTimeout(res, 60000));
            continue
        }

        for (const job of jobs) {
            // console.log(JSON.parse(job))
            const parsed = JSON.parse(job);
            const res = await retryConsumerClient.xAdd(
                "message-events-stream",
                "*",
                {
                    message: parsed.message,
                    messageId: parsed.messageId,
                    retryCount: JSON.stringify(parsed.retryCount),
                    nextRetryAt: JSON.stringify(parsed.nextRetryAt)
                }
            )

            await retryConsumerClient.zRem("retry:zset", job)
        }

    }

}