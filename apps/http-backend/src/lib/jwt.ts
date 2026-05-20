import jwt from "jsonwebtoken";
import ENV_SECRETS from "./ENV";

interface jwt_payload {
    userId: string
}

export function generateToken(userId: string) {

    return jwt.sign({
        userId
    },
        ENV_SECRETS.JWT_SECRET as string,
        { expiresIn: "7d" }
    );
};

export function verifyToken(token: string) {
    return jwt.verify(token, ENV_SECRETS.JWT_SECRET as string) as jwt_payload;
};