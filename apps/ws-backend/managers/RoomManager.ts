import Websocket from "ws" ; 

export class RoomManager {

private static instance: RoomManager ; 

private rooms :Map<string , Set<Websocket>> = new Map() ; // We have used set in here because we cant store duplicates in set and that what we want that's why set and not arrays

private socketRoom :Map<Websocket, Set<string> > = new Map();

private constructor (){

}

static getInstance(){
    if(!RoomManager.instance){
        RoomManager.instance= new RoomManager();
    };
    return RoomManager.instance ;
};

// User joining room logic 

joinRoom (roomId : string , ws:Websocket ){

    if(!this.rooms.has(roomId)){
        this.rooms.set(
            roomId,
            new Set()
        )
    };

    this.rooms.get(roomId)?.add(ws) ;

    if(!this.socketRoom.has(ws)){
        this.socketRoom.set(
            ws,
            new Set()
        )
    };

    this.socketRoom.get(ws)?.add(roomId) ;

    console.log(`Socket joined the room ${roomId}`) ; 
};

}