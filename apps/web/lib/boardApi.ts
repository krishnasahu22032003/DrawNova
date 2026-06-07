import axios from "axios";
import ENV_SECRETS from "./ENV";

export interface AppState {
    zoom: number;
    scrollX: number;
    scrollY: number;
    theme: string;
}

export interface BoardData {
    id: string;
    title: string;
    type: string;
    elements: any[];
    appState: AppState;
    createdAt?: string;
    updatedAt?: string;
}

// Create axios instance
const api = axios.create({
    baseURL: ENV_SECRETS.BASE_BACKEND_URL,
    withCredentials: true, // sends cookies automatically
    headers: {
        "Content-Type": "application/json",
    },
});

export async function fetchUserBoard(): Promise<BoardData> {
    try {
        const { data } = await api.get("/api/v1/board/get/me");

        return data.data;
    } catch (error) {
        console.error("Fetch board error:", error);
        throw new Error("Failed to fetch board");
    }
}

