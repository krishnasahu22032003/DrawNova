import { WebSocket, WebSocketServer } from "ws";
import { createServer } from "http";
import { handleJoinRoom, handleLeaveRoom } from "./handlers/roomHandler";
import ENV from "./utils/ENV";
import { handleDrawShape, handleClearBoard, handleDeleteShape, handleUpdateShape } from "./handlers/shapeHandler";
import { handleCursorMove } from "./handlers/cursorHandler";
import removeSocket from "./handlers/removeSocket";

const Port = ENV.PORT;
const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {

    console.log("New Client connected");

    ws.on("message", (message: Buffer) => {

        try {

            const data = JSON.parse(message.toString());

            switch (data.type) {

                case "JOIN_ROOM":

                    handleJoinRoom(ws, data.payLoad)
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

            };

        } catch (err) {
            console.error("Message parse error:", err)
        };

    });

    ws.on("close", () => {
         removeSocket(ws)
        console.log("Client Disconnected");
    });
});

server.listen(Port, () => {

    console.log(`Server is running on ${Port}`);
});

