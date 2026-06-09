"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import ENV_SECRETS from "../lib/ENV";

interface WSContextType {
    ws: WebSocket | null;
    isConnected: boolean;
}

const WSContext = createContext<WSContextType>({ ws: null, isConnected: false });

export function WSProvider({ children }: { children: React.ReactNode }) {
    const wsRef = useRef<WebSocket | null>(null);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
useEffect(() => {
    console.log("WSProvider mounted");

    if (wsRef.current?.readyState === WebSocket.OPEN) {
        console.log("Socket already open");
        return;
    }

    console.log("Creating websocket...");

    const socket = new WebSocket(ENV_SECRETS.WS_URL!);

       setWs(socket);

    socket.onopen = () => {
        console.log("WSProvider connected");

        setIsConnected(true);
     
    };

    socket.onclose = (event) => {
        console.log(
            "WSProvider closed",
            event.code,
            event.reason
        );

        setIsConnected(false);
        setWs(null);
        wsRef.current = null;
    };

    socket.onerror = (err) => {
        console.log("WSProvider error", err);
    };

    wsRef.current = socket;

    return () => {
        console.log("WSProvider cleanup");
        socket.close();
    };
}, []);

    return (
        <WSContext.Provider value={{ ws, isConnected }}>  {/* ← was wsRef.current, now ws state */}
            {children}
        </WSContext.Provider>
    );
}

export const useWS = () => useContext(WSContext);