import { WebSocket, WebSocketServer } from "ws";
import { createServer } from "http";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import { handleJoinRoom, handleLeaveRoom } from "./handlers/roomHandler";
import { handleDrawShape, handleClearBoard, handleDeleteShape, handleUpdateShape } from "./handlers/shapeHandler";
import { handleCursorMove } from "./handlers/cursorHandler";
import removeSocket from "./handlers/removeSocket";
import ENV from "./utils/ENV";

const Port = ENV.PORT;
const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    const url = new URL(req.url!, `http://localhost`);
    const token = url.searchParams.get("token");

    if (!token) {
        ws.close(1008, "No token");
        return;
    }

    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET) as { userId: string };
        (ws as any).userId = decoded.userId;
    } catch {
        ws.close(1008, "Invalid token");
        return;
    }

    console.log("New Client connected", (ws as any).userId);

    ws.on("message", (message: Buffer) => {
        try {
            const data = JSON.parse(message.toString());

            switch (data.type) {
                case "JOIN_ROOM":
                    handleJoinRoom(ws, data.payLoad);
                    break;
                case "LEAVE_ROOM":
                    handleLeaveRoom(ws, data.payLoad);
                    break;
                case "DRAW":
                    handleDrawShape(ws, data.payLoad);
                    break;
                case "UPDATE_SHAPE":
                    handleUpdateShape(ws, data.payLoad);
                    break;
                case "DELETE_SHAPE":
                    handleDeleteShape(ws, data.payLoad);
                    break;
                case "CURSOR_MOVE":
                    handleCursorMove(ws, data.payLoad);
                    break;
                case "CLEAR_BOARD":
                    handleClearBoard(ws, data.payLoad);
                    break;
                default:
                    console.log("Unknown message type");
            }
        } catch (err) {
            console.error("Message parse error:", err);
        }
    });

    ws.on("close", () => {
        removeSocket(ws);
        console.log("Client Disconnected");
    });
});

server.listen(Port, () => {
    console.log(`WS Server running on ${Port}`);
});