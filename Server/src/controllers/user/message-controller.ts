import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export const composeNewMessage = async (req: Request, res: Response) => {

    const userId = req.user?.id

    if (!userId) return res.status(401).json({ message: 'not authenticated' })

    const { content, userName } = req.body

    try {

        const userReceiver = await prisma.user.findFirst({
            where: {
                name: userName
            }
        })

        if (!userReceiver) return res.json({ success: false, message: 'no user by that name exist' })

        const conversation = await prisma.$transaction(async (tx) => {
            // Step 1: Check if a conversation exists between both users
            const existing = await tx.conversation.findFirst({
                where: {
                    conversationParticipant: {
                        some: { userId: userId },
                    },
                    AND: {
                        conversationParticipant: {
                            some: { userId: userReceiver.id },
                        },
                    },
                },
                include: { conversationParticipant: true },
            });

            //THIS IS INCOMPLETE ----------------------------------------------------------------------
            //      |
            //      |
            if (existing) {
                return existing;
            }

            const result = await tx.conversation.create({
                data: {
                    conversationParticipant: {
                        create: [
                            {
                                userId: userId,
                                isImportant: false,
                                lastMessageRead: false,
                                messageReplied: false,
                            },
                            {
                                userId: userReceiver.id,
                                isImportant: false,
                                lastMessageRead: false,
                                messageReplied: false,
                            },
                        ],
                    },
                    messages: {
                        create: {
                            content: content,
                            automatedMessage: false,
                            senderId: userId
                        }
                    }

                },
                include: { conversationParticipant: true },
            });
            return await tx.conversation.findFirst({
                where: { id: result.id },
                include: {
                    messages: {
                        take: 1,
                        orderBy: {
                            createdAt: 'desc'
                        }
                    },
                    conversationParticipant: {
                        include: {
                            user: {
                                select: {
                                    email: true,
                                    name: true,
                                    id: true,
                                    profile: {
                                        select: {
                                            profileImg: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        });

        return res.status(200).json({
            success: true,
            message: 'sent a message successfully',
            data: conversation
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'failed to compoase a new message'
        })
    }

}

export const getAllMessages = async (req: Request, res: Response) => {

    const userId = req.user?.id

    if (!userId) return res.status(401).json('not authenticated')

    try {

        const result = await prisma.conversation.findMany({
            where: {
                conversationParticipant: {
                    some: { userId: userId }
                }
            },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    take: 10,
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                conversationParticipant: {
                    include: {
                        user: {
                            select: {
                                email: true,
                                name: true,
                                id: true,
                                profile: {
                                    select: {
                                        profileImg: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        return res.status(200).json({
            success: true,
            message: 'fetched all messages',
            data: result
        })

    } catch (err) {

        console.log(err)
        return res.status(500).json({
            message: 'failed to get messages'
        })

    }

}

export const toggleUnread = async (req: Request, res: Response) => {

    const userId = req.user?.id
    const { id } = req.params
    const { read } = req.body
    if (!userId) return res.status(401).json('not authenticated')

    try {

        const result = await prisma.conversationParticipant.update({
            where: {
                id: id,
                userId: userId
            },
            data: {
                lastMessageRead: read
            }
        })

        return res.status(200).json({
            success: 'true',
            message: 'updated last message read'
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json('failed to update read')
    }

}

export const getMessageById = async (req: Request, res: Response) => {

    const { conversationId } = req.params
    const userId = req.user?.id

    if (!userId) return res.status(401).json('not authenticated')

    try {

        const result = await prisma.conversation.findFirst({
            where: { id: conversationId },
            include: {
                conversationParticipant: {
                    include: {
                        user: {
                            select: {
                                email: true,
                                name: true,
                                id: true,
                                profile: {
                                    select: {
                                        profileImg: true
                                    }
                                }
                            }
                        }
                    }
                },
                messages: {
                    take: 10,
                    orderBy: {
                        createdAt: 'desc',
                    }
                }
            }
        })

        if (result) {
            return res.status(200).json({
                success: true,
                message: 'fetched message',
                data: result
            })
        }
        else{
            return res.status(404).json('message not found')
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json('failed to get the message')
    }
}   
