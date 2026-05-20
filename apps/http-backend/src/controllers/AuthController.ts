import { SignUpSchema } from "@repo/validators/Zod";
import { prisma } from "@repo/db/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

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
                password:hashedPassword
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