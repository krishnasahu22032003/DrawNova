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
      },
      { timeout: 30000,  
         maxWait: 10000,
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

export async function LeaveRoom(req: Request, res: Response) {

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

    const room = await prisma.room.findUnique({
        where: { id: roomId }
    });

    if (room?.ownerId === userId) {
        return res.status(400).json({
            success: false,
            message: "Owner cannot leave their own room. Delete it instead."
        });
    }

    const member = await prisma.roomMembers.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId
        }
      }
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "You are not a member of this room"
      });
    };

    await prisma.roomMembers.delete({
      where: {
        roomId_userId: {
          roomId,
          userId
        }
      }
    });
    return res.status(200).json({
      success: true,
      message: "Left room successfully"
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  };
};

export async function getRoom(req: Request, res: Response) {

  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Invalid user"
    });
  }

  const userId = req.userId;

  const parsed = roomSchema.safeParse(req.params);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      error: parsed.error.flatten()
    });
  }

  const { roomId } = parsed.data;

  try {

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        OR: [
          {
            ownerId: userId
          },
          {
            members: {
              some: {
                userId
              }
            }
          }
        ]
      },

      select: {
        id: true,
        name: true,
        owner: true,
        maxUsers: true,
        createdAt: true,
        isActive: true,

        members: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
              }
            }
          }
        }
      }
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Room fetched successfully",
      data: room
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export async function joinRoom(req: Request, res: Response) {

  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  const userId = req.userId;

  const parsed = roomSchema.safeParse(req.params);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      error: parsed.error.flatten()
    });
  }

  const { roomId } = parsed.data;

  try {

    const room = await prisma.room.findUnique({
      where: {
        id: roomId
      }
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    if (!room.isActive) {
      return res.status(400).json({
        success: false,
        message: "Room is inactive"
      });
    }

    const existingMember = await prisma.roomMembers.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId
        }
      }
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "Already joined this room"
      });
    }

    const membersCount = await prisma.roomMembers.count({
      where: { roomId }
    });

    if (membersCount >= room.maxUsers) {
      return res.status(400).json({
        success: false,
        message: "Room is full"
      });
    }

    try {
      await prisma.roomMembers.create({
        data: { roomId, userId }
      });
    } catch (err: any) {

      if (err.code === "P2002") {
        return res.status(400).json({
          success: false,
          message: "Already joined this room"
        });
      }
      throw err;
    }

    return res.status(200).json({
      success: true,
      message: "Joined room successfully"
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export async function getUserRooms(req: Request, res: Response) {

  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  const userId = req.userId;

  try {

    const rooms = await prisma.room.findMany({
      where: {
        OR: [
          {
            ownerId: userId
          },
          {
            members: {
              some: {
                userId
              }
            }
          }
        ],

        isActive: true
      },

      select: {
        id: true,
        name: true,
        createdAt: true,
        maxUsers: true,

        owner: {
          select: {
            id: true,
            username: true,
          }
        },

        _count: {
          select: {
            members: true
          }
        }
      },

      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json({
      success: true,
      message: "Rooms fetched successfully",
      data: rooms
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

