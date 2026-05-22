import { Request, Response } from "express";
import { prisma } from "@repo/db/client";

export async function GetUserBoard(req: Request, res: Response) {

    if (!req.userId) {
        return res.status(401).json({
            success: false,
            message: "Invalid User"
        });
    };

    try {

        const userBoard = await prisma.board.findUnique({
            where: {
                userId: req.userId
            },
            select: {
                id: true,
                elements: true,
                createdAt: true,
                updatedAt: true,
                appState: true
            }
        });

        if (!userBoard) {
            const newBoard = await prisma.board.create({
                data: {
                    userId: req.userId,
                    elements: [],
                    appState: {
                        zoom: 1,
                        scrollX: 0,
                        scrollY: 0,
                    }
                },
                select:{
                      id: true,
                elements: true,
                createdAt: true,
                updatedAt: true,
                appState: true
                }
            });
            
            return res.status(201).json({
                success:true,
                message:"Board created",
                data:newBoard
            });
        };

        return res.status(200).json({
            success: true,
            message: "User board found ",
            data: userBoard
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    };

};


