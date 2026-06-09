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
        const token = document.cookie
            .split("; ")
            .find((r) => r.startsWith("token="))
            ?.split("=")[1];

        if (!token) return;
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        const socket = new WebSocket(`${ENV_SECRETS.WS_URL}?token=${token}`);

        socket.onopen = () => {
            setIsConnected(true);
            setWs(socket);        // ← was missing, this is what makes ws non-null in context
        };

        socket.onclose = () => {
            setIsConnected(false);
            setWs(null);
            wsRef.current = null;
        };

        wsRef.current = socket;

        return () => {
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