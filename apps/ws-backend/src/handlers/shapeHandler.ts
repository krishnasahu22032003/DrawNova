import { RoomManager } from "../managers/RoomManager";
import { DrawShapePayload , UpdateShapePayload , DeleteShapePayload , CursorMovePayload , ClearBoardPayload } from "../types/message";
import WebSocket from "ws";

const roomManager = RoomManager.getInstance() ; 

export function handleDrawShape(ws : WebSocket , payLoad : DrawShapePayload){

    roomManager.broadcast(payLoad.roomId , {
        type : "DRAW",
        payLoad
    }, ws) ; 

} ; 