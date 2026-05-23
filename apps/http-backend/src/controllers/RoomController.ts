import { prisma } from "@repo/db/client";
import { CreateRoomSchema, roomSchema } from "@repo/validators/Zod";
import { Request, Response } from "express";


export async function CreateRoom(req: Request, res: Response) {

  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Invalid User"
    });
  };

  const userId = req.userId;

  const parsedData = CreateRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid Input",
      error: parsedData.error.flatten()
    });
  };

  const { name, maxUsers } = parsedData.data;

  try {

    const result = await prisma.$transaction(

      async (tx) => {

        const room = await tx.room.create({
          data: {
            ownerId: userId,
            maxUsers,
            name,
          },
        });

        const board = await tx.board.create({
          data: {
            title: `${name} Board`,
            type: "ROOM",
            roomId: room.id,
            elements: [],
            appState: {
              zoom: 1,
              scrollX: 0,
              scrollY: 0,
              theme: "dark",
            }
          }
        });

        const roomMembers = await tx.roomMembers.create({
          data: {
            roomId: room.id,
            userId
          }
        });

        return {
          room,
          board
        }
      }
    );
    return res.status(201).json({
      success: true,
      message: "Room created Successfully",
      data: result
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  };

};

export async function DeleteRoom(req: Request, res: Response) {

  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Invalid User"
    });
  };

  const userId = req.userId;

  const parsed = roomSchema.safeParse(req.params);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid Input",
      error: parsed.error.flatten()
    });
  };

  const { roomId } = parsed.data;

  try {
    const room = await prisma.room.findFirst({
      where: {
        id: roomId
      }
    });
    if (!room) {
      return res.status(400).json({
        success: false,
        message: "Invalid roomId"
      });
    };

    if (room.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    };

    await prisma.room.delete({
      where: {
        id: roomId,
      }
    });

    return res.status(200).json({
      message: "Room deleted successfully"
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};