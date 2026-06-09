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
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        const socket = new WebSocket(ENV_SECRETS.WS_URL!);
        wsRef.current = socket;

        socket.onopen = () => {
            console.log("WS connected");
            setWs(socket);
            setIsConnected(true);
        };

        socket.onclose = (event) => {
            console.log("WS closed", event.code, event.reason);
            setIsConnected(false);
            setWs(null);
            wsRef.current = null;
        };

        socket.onerror = (err) => {
            console.error("WS error", err);
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <WSContext.Provider value={{ ws, isConnected }}>
            {children}
        </WSContext.Provider>
    );
}

export const useWS = () => useContext(WSContext);