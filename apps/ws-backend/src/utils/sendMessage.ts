import { WebSocket } from "ws";

export function sendMessage(
  ws: WebSocket,
  data: unknown
) {
  ws.send(JSON.stringify(data));
};