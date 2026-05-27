import express from "express" ; 
import StartServer from "./lib/startServer";
import UserRouter from "./routes/UserRoutes";
import BoardRouter from "./routes/BoardRoutes";
import cookieParser from "cookie-parser";
import compression from "compression";
import RoomRouter from "./routes/RoomRoutes";
import cors from "cors";

const app = express() ; 

app.use(express.json({limit:"10mb"}));
app.use(cookieParser()) ; 
app.use(compression()) ; 
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));

app.use("api/v1/user" , UserRouter) ;
app.use("api/v1/board" , BoardRouter) ; 
app.use("api/v1/room" , RoomRouter) ; 

StartServer(app);