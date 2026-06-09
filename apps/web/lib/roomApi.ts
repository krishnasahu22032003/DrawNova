import AxiosInstance from "./axios";

interface RoomData {
    id: string;
    name: string;
    maxUsers: number;
    createdAt: Date;
    isActive: boolean;
    owner: {
        id: string;
        username: string;
    };
    members: {
        user: {
            id: string;
            username: string;
        };
    }[];
}

interface GetRoomResponse {
    success: boolean;
    message: string;
    data: RoomData;
}

export async function getRoom(roomId: string): Promise<RoomData> {
    try {
        const res = await AxiosInstance.get<GetRoomResponse>(`/api/v1/room/${roomId}`);
        return res.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch room");
    }
}

 