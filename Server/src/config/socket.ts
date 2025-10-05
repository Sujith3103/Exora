import { io } from "..";

export const socketConnection = () => {

    io.on("connection", (socket) => {
        console.log("✅ New client connected:",socket.id);

    });

}
