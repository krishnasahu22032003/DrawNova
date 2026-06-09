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

// User leaving room logic 

leaveRoom(roomId : string , ws : Websocket){
 
    const room = this.rooms.get(roomId) ;

    if(room){
        room.delete(ws);
    };

    if(room?.size === 0){
        this.rooms.delete(roomId);
    };

     const joinedRoom = this.socketRoom.get(ws) ; 

     if(joinedRoom){

        joinedRoom.delete(roomId); 

        if(joinedRoom.size === 0){
            this.socketRoom.delete(ws) ;
        };
     };
    
     console.log(`Socket left room ${roomId}`);
};
 
// BroadCast message to everyone in the room 

broadcast(roomId:string , message:unknown , excludeSocket?:Websocket){

    const room = this.rooms.get(roomId) ;

    if(!room) return ;

    for(const client of room ){

        if(client === excludeSocket){
            continue ;
        };

        if(client.readyState === Websocket.OPEN){
            try{
                client.send(JSON.stringify(message)) ; 
            }catch(err){
                console.error(err)
            };
        }
    };
};

removeSocket(ws:Websocket){

    const joinedRooms = this.socketRoom.get(ws) ; 

    if(!joinedRooms) return ;
     
    for(const roomId of joinedRooms){

        const room = this.rooms.get(roomId) ;

        if(room) {
            room.delete(ws);


      if (room.size === 0) {
        this.rooms.delete(roomId);
      }
        }
    }
      this.socketRoom.delete(ws);

  console.log("Socket disconnected and cleaned");

};
getRoomSize(roomId: string): number {
    return this.rooms.get(roomId)?.size ?? 0;
}

getSocketRooms(ws: Websocket): Set<string> | undefined {
    return this.socketRoom.get(ws);
}

getUniqueUserCount(roomId: string): number {
    const room = this.rooms.get(roomId);

    if (!room) return 0;

    const users = new Set<string>();

    for (const ws of room) {
        users.add((ws as any).userId);
    }

    return users.size;
}

}