        import { WebSocket } from "ws";
        import { RoomManager } from "../managers/RoomManager";

        const roomManager = RoomManager.getInstance();

        export function handleCursorMove(ws: WebSocket, payload: any) {
            const { roomId, x, y } = payload;
            const userId = (ws as any).userId;

            roomManager.broadcast(roomId, {
                type: "CURSOR_MOVE",
                payLoad: { userId, x, y },
            }, ws);
        }