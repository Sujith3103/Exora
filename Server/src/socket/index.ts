import { randomUUID } from "crypto";
import { io } from "../index";
import { publisher, redis, subscriber } from "../utils/redisClient";
import { socketAuthMiddleware } from "./auth/middleware";

type ConversationData =
    {
        conversationId: string,
        otherUserId: string
    }

type PresenceEvent = {
    userId: string;
    status: "online" | "offline";
};

type TypingEvent = {
    conversationId: string;
    userId: string
    typingStatus: "start" | "stop"
}
type MessageInfo = {
    automatedMessage: boolean,
    content: string
    conversationId: string
    createdAt: string | null
    id: string | null
    senderId: string
}   

const SERVER_ID = "server-1"

export const initSocket = () => {
    io.use(socketAuthMiddleware);

    // SUBSCRIBED TO USER PRESENCE EVENT ( online / offline )
    subscriber.subscribe("presence-events", (message: string) => {
        const event: PresenceEvent = JSON.parse(message)
        io.emit(`presence:${event.userId}`, event)
    })

    // SUBSCRIBED TO USER TYPING EVENT 
    subscriber.subscribe("typing-events", (message: string) => {
        const event: TypingEvent = JSON.parse(message)
        io.to(event.conversationId).emit("typing:event", event)
    })

    // PUSHING THE MESSAGE TO THE USER
    subscriber.subscribe("message-events", async(message: string) => {
        const event: MessageInfo = JSON.parse(message)
        console.log("event : ",event)
        io.to(event.conversationId).emit("message:receive", event)
        const now: Date = new Date()
        if (event.createdAt) {
            const createdTime = new Date(event.createdAt)
            const timeTaken = now.getTime() - createdTime.getTime();
            console.log("time taken : ",timeTaken)
            await redis.lPush("latency:list", timeTaken.toString());
        }
    })

    subscriber.subscribe("dlq-replay-events", async (message: any) => {
        console.log("got the sub- [dlq-replay-event]")
        const dlqEvent = JSON.parse(message)
        io.to(dlqEvent.userId.toString()).emit('dlq:replay:result',dlqEvent)
    })
 
    io.on("connection", async (socket) => {
        console.log("Socket connected:", socket.id);

        const userId = socket.data.user.id.toString();
        const user = socket.data.user

        socket.join(userId);
        console.log("socket joined")

        let conversationId: string;

        const count = await redis.hIncrBy('user_sockets', userId, 1)
        if (count === 1) {
            await redis.sAdd('online_users', userId)
            publisher.publish(`presence-events`,
                JSON.stringify({
                    userId,
                    status: 'online'
                })
            )
        }

        // console.log(socket.rooms)

        socket.on("joinConversation", async (conversationData: ConversationData) => {

            conversationId = conversationData.conversationId
            socket.join(conversationData.conversationId)

            const isOnlineUser = await redis.sIsMember('online_users', conversationData.otherUserId)

            socket.emit('isOnlineUser', isOnlineUser)
        })

        socket.on('typing:command', (message: TypingEvent) => {
            const event = JSON.stringify(message)
            publisher.publish("typing-events", event)
        })
        
        socket.on('message:send', async (message) => {
            console.log(message)
            const messageId = randomUUID()

            const res = await redis.xAdd(
                "message-events-stream",
                '*',
                {
                    message: JSON.stringify(message),
                    messageId: messageId,
                    retryCount: JSON.stringify(0),
                    type: 'message',
                    attemptType:'AUTO'
                } 
            )
            console.log("addd event:", res)
            // try {
            //     const res = await prisma.message.create({
            //         data: {
            //             content: message.content,
            //             automatedMessage: message.automatedMessage,
            //             conversationId: message.conversationId,
            //             senderId: message.senderId
            //         }
            //     })
            //     console.log("res:",res)

            // }
            // catch (err) {

            // }
            // io.to(conversationId).emit("message:receive", message)
        })

        // Removed socket.on(conversationId, ...) from here since conversationId may not be assigned yet

        socket.on("disconnect", async () => {
            const count = await redis.hIncrBy("user_sockets", userId, -1);

            if (count === 0) {
                await redis.hDel("user_sockets", userId);
                await redis.sRem("online_users", userId);
                publisher.publish(`presence-events`,
                    JSON.stringify({
                        userId,
                        status: 'offline'
                    })
                )
                console.log("User went offline:", userId);
            }
        });

    });
};
