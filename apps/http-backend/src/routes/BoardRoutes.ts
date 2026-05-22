import express ,{ Router} from "express" ; 
import authMiddleware from "../middleware/AuthMiddleware";
import { GetUserBoard, ResetUserBoard, UpdateUserBoard } from "../controllers/BoardController";

const BoardRouter : Router = express.Router() ; 

BoardRouter.use(authMiddleware);

BoardRouter.get("/get/me", GetUserBoard) ; 
BoardRouter.put("/update/me", UpdateUserBoard) ; 
BoardRouter.delete("/reset/me", ResetUserBoard) ; 

export default BoardRouter ; 