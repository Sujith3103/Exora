import { io } from "../index";
import { publisher, redis, subscriber } from "../utils/redisClient";
import { socketAuthMiddleware } from "./auth/middleware";

type ConversationData = {
    conversationId: string,
    otherUserId: string
}

type PresenceEvent = {
    userId: string;
    status: "online" | "offline";
};


export const initSocket = () => {
    io.use(socketAuthMiddleware);

    subscriber.subscribe("presence-events", (message: string) => {
        const event: PresenceEvent = JSON.parse(message)
        io.emit(`presence:${event.userId}`, event)
    })

    io.on("connection", async (socket) => {
        console.log("Socket connected:", socket.id);

        const userId = socket.data.user.id.toString();

        socket.join(userId);

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

            console.log("converation is emitting")
            socket.join(conversationData.conversationId)

            const isOnlineUser = await redis.sIsMember('online_users', conversationData.otherUserId)

            socket.emit('isOnlineUser', isOnlineUser)
            console.log('isonline user: ', isOnlineUser, conversationData)
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
