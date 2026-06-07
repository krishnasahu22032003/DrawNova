import express ,{ Router} from "express" ; 
import authMiddleware from "../middleware/AuthMiddleware";
import { getBoardById, GetUserBoard, ResetUserBoard, updateBoardById, UpdateUserBoard } from "../controllers/BoardController";

const BoardRouter : Router = express.Router() ; 

BoardRouter.use(authMiddleware);

BoardRouter.get("/get/me", GetUserBoard) ; //
BoardRouter.get("/get/:boardId", getBoardById) ; 
BoardRouter.patch("/update/:boardId",updateBoardById);
BoardRouter.put("/update/me", UpdateUserBoard) ; //
BoardRouter.delete("/reset/me", ResetUserBoard) ; //

export default BoardRouter ; 