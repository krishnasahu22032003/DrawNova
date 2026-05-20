import { SignUpSchema, SignInSchema } from "@repo/validators/Zod";
import { prisma } from "@repo/db/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import ENV_SECRETS from "../lib/ENV";
import jwt from "jsonwebtoken";

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
        const CheckUSer = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                password: true
            }
        });
        if (!CheckUSer || !CheckUSer.password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        };

        const comparePassword = await bcrypt.compare(password, CheckUSer.password);

        if (!comparePassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        };

        if (!ENV_SECRETS.JWT_SECRET) {
            throw new Error("JWT_SECRET missing");
        };

        const token = jwt.sign({ userId: CheckUSer.id }, ENV_SECRETS.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("user_token", token, {
            httpOnly: true,
            secure: ENV_SECRETS.NODE_ENV === 'production',
            sameSite: ENV_SECRETS.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });

        return res.status(200).json({
            success: true,
            message: "User SignIn success"
        });

    } catch (err) {
        console.error((err as Error).message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    };

};

export function UserSignOut(req: Request, res: Response) {

    try {
        res.clearCookie("user_token", {
            httpOnly: true,
            secure: ENV_SECRETS.NODE_ENV === "production",
            sameSite: ENV_SECRETS.NODE_ENV === "production" ? "none" : "lax",
            path:"/"
        });
        return res.status(200).json({
            success: true,
            message: "User signed out"
        });
    } catch (error) {
        console.error("internal server error", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    };
};