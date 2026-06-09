import { WebSocket } from "ws";
import { RoomManager } from "../managers/RoomManager";
import { prisma } from "@repo/db/client";

const roomManager = RoomManager.getInstance();

const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

function debouncedBoardSave(boardId: string, elements: any[]) {
    if (debounceTimers.has(boardId)) clearTimeout(debounceTimers.get(boardId)!);
    debounceTimers.set(
        boardId,
        setTimeout(async () => {
            try {
                await prisma.board.update({
                    where: { id: boardId },
                    data: { elements },
                });
                console.log("Board saved:", boardId);
            } catch (err) {
                console.error("Board save failed:", err);
            }
        }, 2000)
    );
}

// Helper to send error back to the sender
function sendError(ws: WebSocket, message: string) {
    ws.send(JSON.stringify({ type: "ERROR", message }));
}

export function handleDrawShape(ws: WebSocket, payload: any) {
    const { roomId, boardId, shape, elements } = payload;

    if (!roomId || !boardId || !shape) {
        sendError(ws, "DRAW requires roomId, boardId, and shape");
        return;
    }

    // Broadcast only the new shape to peers
    roomManager.broadcast(roomId, {
        type: "DRAW",
        payLoad: { shape },
    }, ws);

    // Save full elements array if client sent it
    if (Array.isArray(elements)) {
        debouncedBoardSave(boardId, elements);
    }
}

export function handleUpdateShape(ws: WebSocket, payload: any) {
    const { roomId, boardId, elements } = payload;

    if (!roomId || !boardId) {
        sendError(ws, "UPDATE_SHAPE requires roomId and boardId");
        return;
    }

    roomManager.broadcast(roomId, {
        type: "UPDATE_SHAPE",
        payLoad: payload,
    }, ws);

    if (Array.isArray(elements)) {
        debouncedBoardSave(boardId, elements);
    }
}

export function handleDeleteShape(ws: WebSocket, payload: any) {
    const { roomId, boardId, elements } = payload;

    if (!roomId || !boardId) {
        sendError(ws, "DELETE_SHAPE requires roomId and boardId");
        return;
    }

    roomManager.broadcast(roomId, {
        type: "DELETE_SHAPE",
        payLoad: payload,
    }, ws);

    if (Array.isArray(elements)) {
        debouncedBoardSave(boardId, elements);
    }
}

export function handleClearBoard(ws: WebSocket, payload: any) {
    const { roomId, boardId } = payload;

    if (!roomId || !boardId) {
        sendError(ws, "CLEAR_BOARD requires roomId and boardId");
        return;
    }

    roomManager.broadcast(roomId, {
        type: "CLEAR_BOARD",
        payLoad: payload,
    }, ws);

    debouncedBoardSave(boardId, []);
}