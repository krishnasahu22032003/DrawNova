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
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const token = document.cookie
            .split("; ")
            .find((r) => r.startsWith("token="))
            ?.split("=")[1];

        if (!token) return;
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        const ws = new WebSocket(`${ENV_SECRETS.WS_URL}?token=${token}`);

        ws.onopen = () => setIsConnected(true);
        ws.onclose = () => {
            setIsConnected(false);
            wsRef.current = null;
        };

        wsRef.current = ws;

        return () => {
            ws.close();
        };
    }, []);

    return (
        <WSContext.Provider value={{ ws: wsRef.current, isConnected }}>
            {children}
        </WSContext.Provider>
    );
}

export const useWS = () => useContext(WSContext);