import express , {Router} from "express" ; 
import { UserSignUp } from "../controllers/AuthController";

const UserRouter:Router= express.Router() ; 

UserRouter.post("/signup" , UserSignUp) ; 

export default UserRouter ; 