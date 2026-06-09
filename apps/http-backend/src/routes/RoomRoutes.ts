import express, { Router } from "express";
import authMiddleware from "../middleware/AuthMiddleware";
import {
  CreateRoom, DeleteRoom, LeaveRoom,getRoom,joinRoom,getUserRooms,
  IsRoomOwner,} from "../controllers/RoomController";

const RoomRouter: Router = express.Router();

RoomRouter.use(authMiddleware);

RoomRouter.post("/create", CreateRoom);

RoomRouter.get("/user", getUserRooms);

RoomRouter.get("/:roomId", getRoom);

RoomRouter.delete("/delete/:roomId", DeleteRoom);

RoomRouter.post("/:roomId/join", joinRoom);

RoomRouter.post("/:roomId/leave", LeaveRoom);

RoomRouter.get("/:roomId/is-owner", IsRoomOwner);



export default RoomRouter;