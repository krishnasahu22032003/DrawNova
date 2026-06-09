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

export async function handleDrawShape(ws: WebSocket, payload: any) {
    const { roomId, boardId, shape, elements } = payload;

    roomManager.broadcast(roomId, { type: "DRAW", payLoad: { shape } }, ws);

    if (elements) {
        debouncedBoardSave(boardId, elements); 
    }
}

export function handleUpdateShape(ws: WebSocket, payload: any) {
    const { roomId, boardId } = payload;

    roomManager.broadcast(
        roomId,
        { type: "UPDATE_SHAPE", payLoad: payload },
        ws
    );

    debouncedBoardSave(boardId, payload.elements);
}

export function handleDeleteShape(ws: WebSocket, payload: any) {
    const { roomId, boardId } = payload;

    roomManager.broadcast(
        roomId,
        { type: "DELETE_SHAPE", payLoad: payload },
        ws
    );

    debouncedBoardSave(boardId, payload.elements);
}

export function handleClearBoard(ws: WebSocket, payload: any) {
    const { roomId, boardId } = payload;

    roomManager.broadcast(
        roomId,
        { type: "CLEAR_BOARD", payLoad: payload },
        ws
    );

    debouncedBoardSave(boardId, []);
}