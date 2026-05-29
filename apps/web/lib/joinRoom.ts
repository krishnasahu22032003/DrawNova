import AxiosInstance from "./axios";

interface JoinRoomResponse {

    success: false,
    message: string

};

export default async function JoinRoom(roomId: string): Promise<JoinRoomResponse> {

    try {

        const res = await AxiosInstance.post<JoinRoomResponse>("/api/v1/room/join", roomId);

        return res.data;

    } catch (error: any) {
        throw new Error(error.response.data.message || "Something Went Wrong");
    };

};