import { SignUpSchema, SignInSchema , UpdateUserSchema} from "@repo/validators/Zod";
import { prisma } from "@repo/db/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "../config/cookie";
import { generateToken } from "../lib/jwt";

const SALT_ROUNDS = 12;

export async function UserSignUp(req: Request, res: Response) {

    const parsedData = SignUpSchema.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid Input",
            error: parsedData.error.flatten()
        })
    };

    const { username, email, password } = parsedData.data;

    try {

        const checkUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (checkUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists please choose another email"
            });
        };

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        if (!newUser) {
            return res.status(500).json({
                success: false,
                message: "User does not created"
            });
        };

        return res.status(201).json({
            success: true,
            message: "SignUp success",
            data: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (err) {
        console.error((err as Error).message);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    };

};

export async function UserSignIn(req: Request, res: Response) {

    const parsedData = SignInSchema.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid Credentials",
            error: parsedData.error.flatten()
        });
    };

    const { email, password } = parsedData.data;

    try {
        const checkUSer = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                email: true,
                username: true,
                password: true
            }
        });
        if (!checkUSer || !checkUSer.password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        };

        const comparePassword = await bcrypt.compare(password, checkUSer.password);

        if (!comparePassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        };


        const token = generateToken(checkUSer.id);

        await prisma.session.create({
            data: {
                token,
                userId: checkUSer.id,
                expiresAt: new Date(
                    Date.now() +
                    7 * 24 * 60 * 60 * 1000
                ),
            }
        });

        res.cookie(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS)
        return res.status(200).json({
            success: true,
            message: "User SignIn success",
            data: {
                id: checkUSer.id,
                username: checkUSer.username,
                email: checkUSer.email,
            },
        });

    } catch (err) {
        console.error((err as Error).message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    };

};

export async function UserSignOut(req: Request, res: Response) {

    try {

        const token = req.cookies[AUTH_COOKIE_NAME];

        if (token) {
            await prisma.session.delete({
                where: {
                    token
                }
            });
        };

        res.clearCookie(AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS)

        return res.status(200).json({
            success: true,
            message: "User signed out",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export async function getUserDetails(req: Request, res: Response) {

    if (!req.userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    };

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.userId
            },
            select: {
                id: true,
                username: true,
                email: true
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist"
            })
        };
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("GetUserDetails Error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    };

};

export async function UpdateUserDetails(
  req: Request,
  res: Response
) {
  const parsedData =
  
    UpdateUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: parsedData.error.flatten(),
    });
  }

  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const {
    username,
    email,
    password,
  } = parsedData.data;

  try {
    const existingUser =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      email &&
      email !== existingUser.email
    ) {
      const emailExists =
        await prisma.user.findUnique({
          where: {
            email,
          },
        });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message:
            "Email already in use",
        });
      }
    }

    let hashedPassword:
      | string
      | undefined;

    if (password) {
      hashedPassword =
        await bcrypt.hash(
          password,
          SALT_ROUNDS
        );
    }

    const updatedUser =
      await prisma.user.update({
        where: {
          id: userId,
        },

        data: {
          ...(username !== undefined && {
            username,
          }),

          ...(email !== undefined && {
            email,
          }),

          ...(hashedPassword !==
            undefined && {
            password: hashedPassword,
          }),
        },

        select: {
          id: true,
          username: true,
          email: true,
          updatedAt: true,
        },
      });

    if (password) {
      await prisma.session.deleteMany({
        where: {
          userId,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",

      data: updatedUser,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  };
};