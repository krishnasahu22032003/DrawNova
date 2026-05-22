import { prisma } from "@repo/db/client";
import { Request , Response } from "express";

export async function CreateRoom(req:Request , res:Response){

 if(!req.userId){
    return res.status(401).json({
        success:false,
        message:"Invalid user"
    });
 };


 


}