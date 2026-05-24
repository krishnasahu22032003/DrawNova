import { RoomManager } from "../managers/RoomManager";
import { JoinRoomPayload } from "../types/message";
import WebSocket from "ws";

const roomManager = RoomManager.getInstance() ; 

export function handleJoinRoom(ws:WebSocket , payLoad : JoinRoomPayload){

roomManager.joinRoom(payLoad.roomId , ws ) ;

};

