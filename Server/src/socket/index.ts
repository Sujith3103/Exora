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

    io.on("connection", async (socket) => {
        console.log("Socket connected:", socket.id);

        const userId = socket.data.user.id.toString();

        socket.join(userId);

        let conversationId;

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

        socket.on("joinConversation", async (conversationData: ConversationData) => {

            // socket.on(`presence:${conversationData.otherUserId}`, (response:PresenceEvent) => {

            //     if (response.status === 'online') {

            //     }

            // })

            conversationId = conversationData.conversationId
            socket.join(conversationData.conversationId)

            const isOnlineUser = await redis.sIsMember('online_users', conversationData.otherUserId)

            socket.emit('isOnlineUser', isOnlineUser)
        })

        socket.on('typing:command', (message: TypingEvent) => {
            const event = JSON.stringify(message)
            publisher.publish("typing-events", event)
        })

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
