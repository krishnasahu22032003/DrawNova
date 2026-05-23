import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({port:8080}) ;
 
const user: WebSocket[] = [] ; 

wss.on("connection", (ws : WebSocket)=>{
    console.log("websocket connection done") ; 

    ws.on("message" , (message : Buffer)=>{
        const data = message.toString();
        console.log(data);

        wss.clients.forEach((client)=>{
            if(client.readyState === WebSocket.OPEN  && ws !== client){
                client.send(data)
            }
        })
    })
})