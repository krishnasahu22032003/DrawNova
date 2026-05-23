import { Request, Response } from "express";
import { prisma } from "@repo/db/client";
import { roomSchema, UpdateBoardSchema } from "@repo/validators/Zod";

export async function GetUserBoard(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    let userBoard =
      await prisma.board.findUnique({
        where: {
          userId_isDefault: {
            userId: req.userId,
            isDefault: true,
          },
        },

        select: {
          id: true,
          title: true,
          type: true,
          elements: true,
          appState: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    if (!userBoard) {
      userBoard =
        await prisma.board.create({
          data: {
            title: "My Board",

            type: "PERSONAL",

            userId: req.userId,

            isDefault: true,

            elements: [],

            appState: {
              zoom: 1,
              scrollX: 0,
              scrollY: 0,
              theme: "dark",
            },
          },

          select: {
            id: true,
            title: true,
            type: true,
            elements: true,
            appState: true,
            createdAt: true,
            updatedAt: true,
          },
        });
    }

    return res.status(200).json({
      success: true,
      message: "Board fetched successfully",
      data: userBoard,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function UpdateUserBoard(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const parsedData =
    UpdateBoardSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid board data",
      error: parsedData.error.flatten(),
    });
  }

  const { elements, appState } =
    parsedData.data;

  try {
    const updatedBoard =
      await prisma.board.update({
        where: {
          userId_isDefault: {
            userId: req.userId,
            isDefault: true,
          },
        },

        data: {
          elements,
          appState,
        },

        select: {
          id: true,
          title: true,
          type: true,
          elements: true,
          appState: true,
          updatedAt: true,
        },
      });

    return res.status(200).json({
      success: true,
      message: "Board updated successfully",
      data: updatedBoard,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function ResetUserBoard(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const resetBoard =
      await prisma.board.update({
        where: {
          userId_isDefault: {
            userId: req.userId,
            isDefault: true,
          },
        },

        data: {
          elements: [],

          appState: {
            zoom: 1,
            scrollX: 0,
            scrollY: 0,
            theme: "dark",
          },
        },

        select: {
          id: true,
          title: true,
          type: true,
          elements: true,
          appState: true,
          updatedAt: true,
        },
      });

    return res.status(200).json({
      success: true,
      message: "Board reset successfully",
      data: resetBoard,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export async function getBoardById(req: Request,res: Response) {

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
      message: "Invalid board id",
      error: parsed.error.flatten()
    });
  }

  const { roomId: boardId } = parsed.data;

  try {

    const board = await prisma.board.findFirst({
      where: {

        id: boardId,

        OR: [
          {
            userId
          },

          {
            room: {
              members: {
                some: {
                  userId
                }
              }
            }
          }
        ]
      },

      select: {
        id: true,
        title: true,
        type: true,
        elements: true,
        appState: true,
        createdAt: true,
        updatedAt: true,

        roomId: true,
        userId: true
      }
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Board fetched successfully",
      data: board
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export async function updateBoardById( req: Request,res: Response) {

  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  const userId = req.userId;

  const parsedParams = roomSchema.safeParse(req.params);

  if (!parsedParams.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid board id",
      error: parsedParams.error.flatten()
    });
  }

  const parsedBody = UpdateBoardSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid board data",
      error: parsedBody.error.flatten()
    });
  }

  const { roomId: boardId } = parsedParams.data;

  const { elements, appState } = parsedBody.data;

  try {

    const existingBoard =
      await prisma.board.findFirst({
        where: {

          id: boardId,

          OR: [

            {
              userId
            },

            {
              room: {
                members: {
                  some: {
                    userId
                  }
                }
              }
            }
          ]
        }
      });

    if (!existingBoard) {
      return res.status(404).json({
        success: false,
        message: "Board not found or unauthorized"
      });
    }

    const updatedBoard =
      await prisma.board.update({
        where: {
          id: boardId
        },

        data: {
          elements,
          appState
        },

        select: {
          id: true,
          title: true,
          type: true,
          elements: true,
          appState: true,
          updatedAt: true
        }
      });

    return res.status(200).json({
      success: true,
      message: "Board updated successfully",
      data: updatedBoard
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}