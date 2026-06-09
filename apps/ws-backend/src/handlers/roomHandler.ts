import { WebSocket } from "ws";
import { RoomManager } from "../managers/RoomManager";
import { prisma } from "@repo/db/client";

const roomManager = RoomManager.getInstance();

export async function handleJoinRoom(ws: WebSocket, payload: any) {
    const { roomId } = payload;
    const userId = (ws as any).userId;

    const member = await prisma.roomMembers.findUnique({
        where: { roomId_userId: { roomId, userId } },
    });

    if (!member) {
        ws.send(JSON.stringify({ type: "ERROR", message: "Not a member of this room" }));
        return;
    }

    const board = await prisma.board.findFirst({
        where: { roomId },
        select: { id: true, elements: true, appState: true },
    });

    roomManager.joinRoom(roomId, ws);

    ws.send(JSON.stringify({
        type: "JOINED",
        payLoad: {
            roomId,
            boardId: board?.id,
            elements: board?.elements ?? [],
            appState: board?.appState,
            memberCount: roomManager.getRoomSize(roomId),
        },
    }));

    roomManager.broadcast(roomId, {
        type: "MEMBER_JOINED",
        payLoad: {
            userId,
            memberCount: roomManager.getRoomSize(roomId),
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
        userId: (ws as any).userId,
        memberCount: room.size, // already shrunk
    },
});
}