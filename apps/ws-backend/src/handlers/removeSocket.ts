import WebSocket from "ws";
import { RoomManager } from "../managers/RoomManager";

const roomManager = RoomManager.getInstance();

export default function removeSocket(ws: WebSocket) {
    const joinedRooms = roomManager.getSocketRooms(ws);

    if (joinedRooms) {
        for (const roomId of joinedRooms) {
            roomManager.broadcast(roomId, {
                type: "MEMBER_LEFT",
                payLoad: {
                    userId: (ws as any).userId,
                    memberCount: roomManager.getRoomSize(roomId) - 1,
                },
            });
        }
    }

    roomManager.removeSocket(ws);
}