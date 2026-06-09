import { useCallback, useEffect, useRef, useState } from "react";
import { Shape } from "../types/Shape";
import { useWS } from "../contexts/WSContext";

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

    const { ws, isConnected } = useWS();



    const [shapes, setShapes] = useState<Shape[]>([]);
    const setShapesLocal = useCallback(
        (updater: Shape[] | ((prev: Shape[]) => Shape[])) => {
            setShapes(updater);
        },
        []
    );

    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [syncState, setSyncState] = useState<SyncState>({
        status: "loading",
        lastSaved: null,
        memberCount: 0,
    });
    const [cursors, setCursors] = useState<RemoteCursor[]>([]);

    const boardIdRef = useRef<string | null>(null);
    const boardLoadedRef = useRef(false);

    useEffect(() => {
        if (!ws) return;
        if (!roomId) return;

        const handleMessage = (event: MessageEvent) => {
            const msg = JSON.parse(event.data);
            console.log("JOINED RECEIVED");
            if (msg.type === "JOINED") {
                console.log("JOINED RECEIVED");
                boardIdRef.current = msg.payLoad.boardId;

                setShapes(msg.payLoad.elements || []);

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
                    prev.map((s) =>
                        s.id === msg.payLoad.shape.id
                            ? msg.payLoad.shape
                            : s
                    )
                );
            }

            if (msg.type === "DELETE_SHAPE") {
                setShapes((prev) =>
                    prev.filter((s) => s.id !== msg.payLoad.shapeId)
                );
            }

            if (msg.type === "CLEAR_BOARD") {
                setShapes([]);
            }

            if (
                msg.type === "MEMBER_JOINED" ||
                msg.type === "MEMBER_LEFT"
            ) {
                setSyncState((prev) => ({
                    ...prev,
                    memberCount: msg.payLoad.memberCount,
                }));
            }

            if (msg.type === "CURSOR_MOVE") {
                setCursors((prev) => {
                    const others = prev.filter(
                        (c) => c.userId !== msg.payLoad.userId
                    );

                    return [
                        ...others,
                        {
                            userId: msg.payLoad.userId,
                            x: msg.payLoad.x,
                            y: msg.payLoad.y,
                        },
                    ];
                });
            }
        };

        ws.addEventListener("message", handleMessage);
        console.log("Sending JOIN_ROOM", roomId);
        ws.send(
            JSON.stringify({
                type: "JOIN_ROOM",
                payLoad: { roomId },
            })
        );



        return () => {


            if (ws.readyState === WebSocket.OPEN) {
                ws.send(
                    JSON.stringify({
                        type: "LEAVE_ROOM",
                        payLoad: { roomId },
                    })
                );
            }

            ws.removeEventListener("message", handleMessage);
        };
    }, [ws, roomId, isConnected]);



    const addShape = useCallback(
        (
            updater: Shape[] | ((prev: Shape[]) => Shape[]),
            currentZoom: number,
            currentOffset: { x: number; y: number }
        ) => {
            setShapes((prev) => {
                const next = typeof updater === "function" ? updater(prev) : updater;

                console.log("updateShapes called");
                console.log("ws state", ws?.readyState);
                console.log("boardLoaded", boardLoadedRef.current);

                if (boardLoadedRef.current && ws?.readyState === WebSocket.OPEN) {
                    setSyncState((s) => ({ ...s, status: "saving" }));
                    console.log("Sending DRAW");
                    ws.send(JSON.stringify({

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
        [roomId, ws]
    );

    const sendCursor = useCallback(
        (x: number, y: number) => {
            if (ws?.readyState === WebSocket.OPEN) {
                console.log("Sending cursor", x, y);
                console.log("WS State", ws?.readyState);
                ws.send(JSON.stringify({
                    type: "CURSOR_MOVE",
                    payLoad: { roomId, x, y },
                }));
            }
        },
        [roomId, ws]
    );
    const updateShape = useCallback(
        (shape: Shape, elements: Shape[]) => {
            if (!ws || !boardIdRef.current) return;

            ws.send(
                JSON.stringify({
                    type: "UPDATE_SHAPE",
                    payLoad: {
                        roomId,
                        boardId: boardIdRef.current,
                        shape,
                        elements,
                    },
                })
            );
        },
        [roomId, ws]
    );
    const deleteShape = useCallback(
        (shapeId: string, elements: Shape[]) => {
            if (!ws || !boardIdRef.current) return;

            ws.send(
                JSON.stringify({
                    type: "DELETE_SHAPE",
                    payLoad: {
                        roomId,
                        boardId: boardIdRef.current,
                        shapeId,
                        elements,
                    },
                })
            );
        },
        [roomId, ws]
    );


    return {
        shapes,
        setShapes: setShapesLocal,
        addShape,
        zoom,
        setZoom,
        offset,
        setOffset,
        syncState,
        cursors,
        sendCursor,
        updateShape,
        deleteShape
    };
}