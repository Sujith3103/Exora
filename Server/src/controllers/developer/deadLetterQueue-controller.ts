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