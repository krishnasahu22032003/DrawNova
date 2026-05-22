import express from "express" ; 
import StartServer from "./lib/startServer";
import UserRouter from "./routes/UserRoutes";
import BoardRouter from "./routes/BoardRoutes";
import cookieParser from "cookie-parser";
import compression from "compression";

const app = express() ; 

app.use(express.json({limit:"10mb"}));
app.use(cookieParser()) ; 
app.use(compression()) ; 

app.use("api/v1/user" , UserRouter) ;
app.use("api/v1/board" , BoardRouter) ;

StartServer(app);