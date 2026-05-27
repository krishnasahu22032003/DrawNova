import express , {Router} from "express" ; 
import { getUserDetails, UpdateUserDetails, UserSignIn, UserSignOut, UserSignUp } from "../controllers/AuthController";
import authMiddleware from "../middleware/AuthMiddleware";

const UserRouter:Router= express.Router() ; 

UserRouter.post("/signup" , UserSignUp) ; 
UserRouter.post("/signin" , UserSignIn) ; 
UserRouter.delete("/signout" ,UserSignOut) ; 
UserRouter.get("/me" , authMiddleware,getUserDetails) ; 
UserRouter.patch("/update" , authMiddleware,UpdateUserDetails) ; 

export default UserRouter ; 