import { Request, Response, NextFunction, } from "express";
import { prisma } from "@repo/db/client";
import { AUTH_COOKIE_NAME } from "../config/cookie";
import { verifyToken } from "../lib/jwt";

export default async function authMiddleware(req:Request ,res:Response , next:NextFunction){

const token = req.cookies[AUTH_COOKIE_NAME] ; 

if(!token){
  return res.status(401).json({
    success:false,
    message:"Token missing"
  });
};

try{
const decoded = verifyToken(token) ; 
const session = await prisma.session.findUnique({
  where:{
    token
  }
});

   if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired",
      });
    };
      if (session.expiresAt < new Date()) {
      await prisma.session.delete({
        where: {
          id: session.id,
        },
      });

      return res.status(401).json({
        success: false,
        message: "Session expired",
      });
    }

    req.userId = decoded.userId;
}catch(error){
  console.error(error);

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  };
};