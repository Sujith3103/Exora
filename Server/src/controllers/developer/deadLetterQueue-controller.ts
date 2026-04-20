import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';
import { success } from 'zod';
import { redis } from '../../utils/redisClient';

export const getDeadLetterQueueEvents = async (req: Request, res: Response) => {

    try {
        const dlqData = await prisma.deadLetterQueue.findMany()

        return res.status(200).json({
            success: true,
            message: "fetched dlq Data successfully",
            dlqData
        })
    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "failed to retrieve dlq data"
        })

    }


}


export const getDLQExecutionTimeline = async (req: Request, res: Response) => {

    const userRole = req.user?.role

    if (userRole !== 'DEVELOPER') return res.status(401).json({ message: 'user is unAuthorized' })

    const { id } = req.params

    try {
        const lastAttempt = await prisma.retryAttempt.findFirst({
            where: { eventId: id },
            orderBy: { attemptNo: 'desc' }
        });

        res.status(200).json({
            success: true,
            message: "fetched dlq execution timeline",
            lastAttempt
        })

    } catch (err) {
        res.status(500).json({
            message: "failed ot fetch dlq execution timeline"
        })
    }

}

export const replayDLQEvent = async (req: Request, res: Response) => {

    const userRole = req.user?.role

    if (userRole !== 'DEVELOPER' || !req.user?.id) return res.status(401).json({ message: 'user is unAuthorized' })

    const data = req.body
    console.log(data)

    try {
        const response = await redis.xAdd(
            "message-events-stream",
            '*',
            {
                message: JSON.stringify(data.eventMetaData),
                messageId: data.eventId,
                retryCount: JSON.stringify(data.retryCount + 1),
                type: data.eventType,
                attemptType: 'MANUAL',
                userId : req.user?.id
            }
        )

        res.status(200).json('Event added to redis stream')
    } catch (err) {
        console.log(err)
        res.status(500).json("failed to add event to redis stream")
    }

}