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
