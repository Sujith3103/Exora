import jwt from "jsonwebtoken";

export const socketAuthMiddleware = (socket: any, next: any) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET!);
        console.log("user: ",user)
        socket.data.user = user;
        next();
    } catch {
        next(new Error("Invalid token"));
    }
};
