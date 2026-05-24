import { WebSocket } from "ws";
import { CursorMovePayload } from "../types/message";
import { RoomManager } from "../managers/RoomManager";

const roomManager = RoomManager.getInstance();

export function handleCursorMove(
  ws: WebSocket,
  payload: CursorMovePayload
) {
  roomManager.broadcast(payload.roomId, {
    type: "CURSOR_MOVE",
    payload
  }, ws);
}