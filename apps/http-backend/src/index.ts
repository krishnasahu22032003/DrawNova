import express from "express" ; 
import StartServer from "./lib/startServer";

const app = express() ; 

app.use(express.json());






StartServer(app);