import { WebSocket, WebSocketServer } from "ws";
import {createServer} from "http" ;
import { RoomManager } from "./managers/RoomManager";

const server = createServer();
const wss = new WebSocketServer({server}) ;
const roomManager = RoomManager.getInstance() ;

const user: WebSocket[] = [] ; 

wss.on("connection", (ws : WebSocket)=>{

    console.log("New Client connected") ; 

    ws.on("message" , (message : Buffer)=>{

        const data = JSON.parse(message.toString());

        switch(data.type){

            case "JOIN_ROOM":

            roomManager.joinRoom(data.payLoad.roomId , ws);
            break;

            case "LEAVE_ROOM":

            roomManager.leaveRoom(data.payLoad.roomId , ws);
            break;

            case "DRAW":

            roomManager.broadcast(data.payLoad.roomId , data , ws) ;
            break; 

        };

    });

    ws.on("close",()=>{
        roomManager.removeSocket(ws) ;
    });
});

