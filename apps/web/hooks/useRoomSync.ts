import { useCallback, useEffect, useRef, useState } from "react";
import { fetchBoardById } from "../lib/boardApi";
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

                const ws = new WebSocket(
                    `${ENV_SECRETS.WS_URL}/ws?token=${token}`
                );
                wsRef.current = ws;

                ws.onopen = () => {
                    ws.send(JSON.stringify({ type: "join", roomId, payload: {} }));
                };

                ws.onmessage = async (event) => {
                    const msg = JSON.parse(event.data);

                    if (msg.type === "joined") {
                        boardIdRef.current = msg.boardId;
                        setSyncState((prev) => ({ ...prev, memberCount: msg.memberCount }));

                        try {
                            const board = await fetchBoardById(msg.boardId);
                            if (board.elements?.length > 0) {
                                setShapes(board.elements as Shape[]);
                            }
                            if (board.appState) {
                                setZoom(board.appState.zoom ?? 1);
                                setOffset({ x: board.appState.scrollX ?? 0, y: board.appState.scrollY ?? 0 });
                            }
                        } catch {
                            setSyncState((prev) => ({ ...prev, status: "error" }));
                        }

                        boardLoadedRef.current = true;
                        setSyncState((prev) => ({ ...prev, status: "idle", lastSaved: new Date() }));
                    }

                    if (msg.type === "shapes_update") {
                        setShapes(msg.elements as Shape[]);
                    }

                    if (msg.type === "member_joined" || msg.type === "member_left") {
                        setSyncState((prev) => ({ ...prev, memberCount: msg.memberCount }));
                    }

                    if (msg.type === "cursor_move") {
                        setCursors((prev) => {
                            const others = prev.filter((c) => c.userId !== msg.userId);
                            return [...others, { userId: msg.userId, x: msg.x, y: msg.y }];
                        });
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
                    wsRef.current.send(
                        JSON.stringify({
                            type: "shapes_update",
                            roomId,
                            payload: {
                                boardId: boardIdRef.current,
                                elements: next,
                                appState: {
                                    zoom: currentZoom,
                                    scrollX: currentOffset.x,
                                    scrollY: currentOffset.y,
                                    theme: document.documentElement.classList.contains("dark")
                                        ? "dark"
                                        : "light",
                                },
                            },
                        })
                    );

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
                wsRef.current.send(
                    JSON.stringify({ type: "cursor_move", roomId, payload: { x, y } })
                );
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