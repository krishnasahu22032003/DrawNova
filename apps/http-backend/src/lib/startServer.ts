import { Express } from "express";
import ENV_SECRETS from "./ENV";

export default function StartServer(app: Express) {

    const http_port = ENV_SECRETS.PORT;

    try {
        app.listen(http_port, (() => {
            console.log(`App is running on port ${http_port}`);
        }))
    } catch (err) {
        console.error((err as Error).message);
        process.exit(1);
    }
} ; 