import { socket } from "@/config/socket";
import { createContext, useContext, useEffect, useState } from "react";

interface SocketContextType {
    socket: typeof socket;
    connected: boolean;
}

const SocketContext = createContext<any>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        socket.on("connect", () => setConnected(true));
        socket.on("disconnect", () => setConnected(false));

        return () => {
            socket.off("connect");
            socket.off("disconnect");
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, connected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
