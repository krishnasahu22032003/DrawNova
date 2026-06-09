import { useCallback, useEffect, useRef, useState } from "react";
import { Shape } from "../types/Shape";
import ENV_SECRETS from "../lib/ENV";

interface SyncState {
    status: "loading" | "saving" | "saved" | "error" | "idle";
    lastSaved: Date | null;
    memberCount: number;
}

interface RemoteCursor {
    userId: string;
    x: number;
    y: number;
}

export function useRoomSync(roomId: string) {
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [syncState, setSyncState] = useState<SyncState>({
        status: "loading",
        lastSaved: null,
        memberCount: 0,
    });
    const [cursors, setCursors] = useState<RemoteCursor[]>([]);

    const wsRef = useRef<WebSocket | null>(null);
    const boardIdRef = useRef<string | null>(null);
    const boardLoadedRef = useRef(false);

    useEffect(() => {
        async function init() {
            try {
                const token = document.cookie
                    .split("; ")
                    .find((r) => r.startsWith("token="))
                    ?.split("=")[1];

                const ws = new WebSocket(`${ENV_SECRETS.WS_URL}?token=${token}`);
                wsRef.current = ws;

                ws.onopen = () => {
                    ws.send(JSON.stringify({
                        type: "JOIN_ROOM",
                        payLoad: { roomId },
                    }));
                };

                ws.onmessage = async (event) => {
                    const msg = JSON.parse(event.data);

                    if (msg.type === "JOINED") {
                        boardIdRef.current = msg.payLoad.boardId;
                        setShapes(msg.payLoad.elements as Shape[]);
                        if (msg.payLoad.appState) {
                            setZoom(msg.payLoad.appState.zoom ?? 1);
                            setOffset({
                                x: msg.payLoad.appState.scrollX ?? 0,
                                y: msg.payLoad.appState.scrollY ?? 0,
                            });
                        }
                        setSyncState((prev) => ({
                            ...prev,
                            status: "idle",
                            lastSaved: new Date(),
                            memberCount: msg.payLoad.memberCount,
                        }));
                        boardLoadedRef.current = true;
                    }

                    if (msg.type === "DRAW") {
                        setShapes((prev) => [...prev, msg.payLoad.shape]);
                    }

                    if (msg.type === "UPDATE_SHAPE") {
                        setShapes((prev) =>
                            prev.map((s) => s.id === msg.payLoad.shape.id ? msg.payLoad.shape : s)
                        );
                    }

                    if (msg.type === "DELETE_SHAPE") {
                        setShapes((prev) => prev.filter((s) => s.id !== msg.payLoad.shapeId));
                    }

                    if (msg.type === "CLEAR_BOARD") {
                        setShapes([]);
                    }

                    if (msg.type === "MEMBER_JOINED" || msg.type === "MEMBER_LEFT") {
                        setSyncState((prev) => ({ ...prev, memberCount: msg.payLoad.memberCount }));
                    }

                    if (msg.type === "CURSOR_MOVE") {
                        setCursors((prev) => {
                            const others = prev.filter((c) => c.userId !== msg.payLoad.userId);
                            return [...others, { userId: msg.payLoad.userId, x: msg.payLoad.x, y: msg.payLoad.y }];
                        });
                    }

                    if (msg.type === "ERROR") {
                        console.error("WS error:", msg.message);
                        setSyncState((prev) => ({ ...prev, status: "error" }));
                    }
                };

                ws.onerror = () => {
                    setSyncState((prev) => ({ ...prev, status: "error" }));
                };

            } catch {
                setSyncState((prev) => ({ ...prev, status: "error" }));
            }
        }

        init();

        return () => {
            wsRef.current?.close();
        };
    }, [roomId]);

    const updateShapes = useCallback(
        (
            updater: Shape[] | ((prev: Shape[]) => Shape[]),
            currentZoom: number,
            currentOffset: { x: number; y: number }
        ) => {
            setShapes((prev) => {
                const next = typeof updater === "function" ? updater(prev) : updater;

                if (boardLoadedRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
                    setSyncState((s) => ({ ...s, status: "saving" }));
                    wsRef.current.send(JSON.stringify({
                        type: "DRAW",
                        payLoad: {
                            roomId,
                            boardId: boardIdRef.current,
                            shape: next[next.length - 1],
                            elements: next,
                        },
                    }));

                    setTimeout(() => {
                        setSyncState((s) =>
                            s.status === "saving"
                                ? { ...s, status: "saved", lastSaved: new Date() }
                                : s
                        );
                        setTimeout(() => {
                            setSyncState((s) =>
                                s.status === "saved" ? { ...s, status: "idle" } : s
                            );
                        }, 2000);
                    }, 300);
                }

                return next;
            });
        },
        [roomId]
    );

    const sendCursor = useCallback(
        (x: number, y: number) => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    type: "CURSOR_MOVE",
                    payLoad: { roomId, x, y },
                }));
            }
        },
        [roomId]
    );

    return {
        shapes,
        setShapes: updateShapes,
        zoom,
        setZoom,
        offset,
        setOffset,
        syncState,
        cursors,
        sendCursor,
    };
}