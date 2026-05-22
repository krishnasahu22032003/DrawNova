import { Request, Response } from "express";
import { prisma } from "@repo/db/client";
import { CreateRoomSchema } from "@repo/validators/Zod";

export async function CreateRoom(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
   
  const userId = req.userId ; 

  const parsedData =
    CreateRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      error: parsedData.error.flatten(),
    });
  }

  const { name, maxUsers } = parsedData.data;

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        // 1. Create Room
        const room = await tx.room.create({
          data: {
            name,
            maxUsers,
            ownerId: userId
          },
        });

        // 2. Create Collaborative Board
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
            },
          },
        });

        // 3. Add Owner As Room Member
        await tx.roomMembers.create({
          data: {
            roomId: room.id,
            userId: userId
          },
        });

        return {
          room,
          board,
        };
      }
    );

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}