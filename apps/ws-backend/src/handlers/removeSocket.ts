import WebSocket from "ws";
import { RoomManager } from "../managers/RoomManager";

const roomManager = RoomManager.getInstance() ; 

export default function removeSocket(ws : WebSocket){

    roomManager.removeSocket(ws);
};