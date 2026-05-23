import { WebSocket, WebSocketServer } from "ws";
import { createServer } from "http";
import { RoomManager } from "./managers/RoomManager";
import ENV from "./utils/ENV";

const Port = ENV.PORT;
const server = createServer();
const wss = new WebSocketServer({ server });
const roomManager = RoomManager.getInstance();

wss.on("connection", (ws: WebSocket) => {

    console.log("New Client connected");

    ws.on("message", (message: Buffer) => {

        try {

            const data = JSON.parse(message.toString());

            switch (data.type) {

                case "JOIN_ROOM":

                    roomManager.joinRoom(data.payLoad.roomId, ws);
                    break;

                case "LEAVE_ROOM":

                    roomManager.leaveRoom(data.payLoad.roomId, ws);
                    break;

                case "DRAW":

                    roomManager.broadcast(data.payLoad.roomId, data, ws);
                    break;

            };

        } catch (err) {
            console.error("Message parse error:", err)
        };

    });

    ws.on("close", () => {
        roomManager.removeSocket(ws);
        console.log("Client Disconnected");
    });
});

server.listen(Port, () => {

    console.log(`Server is running on ${Port}`);
});

