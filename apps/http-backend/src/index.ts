import express from "express" ; 
import StartServer from "./lib/startServer";
import UserRouter from "./routes/UserRoutes";
import BoardRouter from "./routes/BoardRoutes";
import cookieParser from "cookie-parser";

const app = express() ; 

app.use(express.json());
app.use(cookieParser()) ; 

app.use("api/v1/user" , UserRouter) ;
app.use("api/v1/board" , BoardRouter) ;

StartServer(app);