import { Request, Response } from "express";
import { prisma } from "@repo/db/client";
import { UpdateBoardSchema } from "@repo/validators/Zod";

export async function GetUserBoard(req: Request, res: Response) {

    if (!req.userId) {
        return res.status(401).json({
            success: false,
            message: "Invalid User"
        });
    };

    try {

        const userBoard = await prisma.board.findFirst({
            where: {
                userId: req.userId,
                isDefault: true
                
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
                select: {
                    id: true,
                    elements: true,
                    createdAt: true,
                    updatedAt: true,
                    appState: true
                }
            });

            return res.status(201).json({
                success: true,
                message: "Board created",
                data: newBoard
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

export async function UpdateUserBoard(req: Request, res: Response) {

    if (!req.userId) {
        return res.status(401).json({
            success: false,
            message: "User not found"
        });
    };

    const parsedData = UpdateBoardSchema.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid input",
            error: parsedData.error.flatten()
        });
    };

    const { appState, elements } = parsedData.data;

    try {
        const updateBoard = await prisma.board.update({
            where: {
                id:board.id
            },
            data: {
                appState,
                elements
            },
            select: {
                id: true,
                appState: true,
                elements: true,
                updatedAt: true
            }
        });
        if (!updateBoard) {
            return res.status(400).json({
                success: false,
                message: "Board not updated"
            });
        };

        return res.status(200).json({
            success: true,
            message: "Board updated successfully",
            data: updateBoard
        });
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    };

};

export async function ResetUserBoard(req: Request, res: Response) {

    if (!req.userId) {
        return res.status(401).json({
            success: false,
            message: "User not found"
        });
    };

    try {
        const resetBoard = await prisma.board.update({
            where: {
                userId: req.userId,
                isDefault:true
            },
            data: {
                elements: [],
                appState: {
                    zoom: 1,
                    scrollX: 0,
                    scrollY: 0
                }
            },
            select:{
                id:true ,
                elements:true,
                appState:true,
                updatedAt:true
            }
        });
        return res.status(200).json({
            success: true,
            message: "User board reset",
            data: resetBoard
        });
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    };
};

