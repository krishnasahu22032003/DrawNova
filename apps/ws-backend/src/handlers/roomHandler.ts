import { WebSocket } from "ws";
import { RoomManager } from "../managers/RoomManager";
import { prisma } from "@repo/db/client";

const roomManager = RoomManager.getInstance();

export async function handleJoinRoom(ws: WebSocket, payload: any) {
    
    const { roomId } = payload;
    const userId = (ws as any).userId;
console.log("JOIN_ROOM REQUEST", roomId, userId);
    const member = await prisma.roomMembers.findUnique({
        where: { roomId_userId: { roomId, userId } },
    });
console.log("MEMBER FOUND", !!member);
    if (!member) {
        ws.send(JSON.stringify({ type: "ERROR", message: "Not a member of this room" }));
        return;
    }

    const board = await prisma.board.findFirst({
        where: { roomId },
        select: { id: true, elements: true, appState: true },
    });
console.log("BOARD FOUND", !!board);
    roomManager.joinRoom(roomId, ws);
console.log("SENDING JOINED");
    ws.send(JSON.stringify({
        type: "JOINED",
        payLoad: {
            roomId,
            boardId: board?.id,
            elements: board?.elements ?? [],
            appState: board?.appState,
            memberCount: roomManager.getUniqueUserCount(roomId),
        },
    }));

    roomManager.broadcast(roomId, {
        type: "MEMBER_JOINED",
        payLoad: {
            userId,
            memberCount: roomManager.getUniqueUserCount(roomId),
        },
    }, ws);
}

export function handleLeaveRoom(ws: WebSocket, payload: any) {
    const { roomId } = payload;
    const userId = (ws as any).userId;

    roomManager.leaveRoom(roomId, ws);

    roomManager.broadcast(roomId, {
        type: "MEMBER_LEFT",
        payLoad: {
            userId,
            memberCount: roomManager.getUniqueUserCount(roomId), 
        },
    });
}