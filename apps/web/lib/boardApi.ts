import axios from "axios";
import ENV_SECRETS from "./ENV";

export interface AppState {
    zoom: number;
    scrollX: number;
     scrollY: number;
  theme: "light" | "dark";
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

export async function saveUserBoard(
    elements: any[],
    appState: AppState
): Promise<BoardData> {
    try {
        const { data } = await api.put("/api/v1/board/update/me", {
            elements,
            appState,
        });

        return data.data;
    } catch (error : any) {
        console.error("Save board error:", error.response?.data);
       if (axios.isAxiosError(error)) {
            console.error("Save board error:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
        }
        throw new Error("Failed to save board");
    }
};

export async function resetUserBoard(): Promise<BoardData> {
    const { data } = await api.delete("/api/v1/board/reset/me");
    return data.data;
} ;

export async function fetchBoardById(boardId: string): Promise<BoardData> {
    const { data } = await api.get(`/api/v1/board/get/${boardId}`);
    return data.data;
};

export async function saveBoardById(
    boardId: string,
    elements: any[],
    appState: AppState
): Promise<BoardData> {
    const { data } = await api.patch(`/api/v1/board/update/${boardId}`, {
        elements,
        appState,
    });
    return data.data;
}
