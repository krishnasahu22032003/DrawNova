import express from "express" ; 
import StartServer from "./lib/startServer";
import UserRouter from "./routes/UserRoutes";

const app = express() ; 

app.use(express.json());

app.use("api/v1/user" , UserRouter)




StartServer(app);