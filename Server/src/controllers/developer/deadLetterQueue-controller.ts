import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';
import { success } from 'zod';

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
            message:"failed ot fetch dlq execution timeline"
        })
    }

}