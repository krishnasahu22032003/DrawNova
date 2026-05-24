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

export function handleUpdateShape(ws :WebSocket , payLoad : UpdateShapePayload){

roomManager.broadcast(payLoad.roomId , {
    type:"UPDATE_SHAPE",
    payLoad
},ws) ;

};

export function handleDeleteShape(ws:WebSocket  , payLoad : DeleteShapePayload){

roomManager.broadcast(payLoad.roomId , {
    type:"DELETE_SHAPE",
    payLoad
},ws); 
};