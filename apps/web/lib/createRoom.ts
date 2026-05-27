import AxiosInstance from "./axios";

interface CreateRoomInput {
  name: string;
  maxUsers: number;
}

interface Data {
  room: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    ownerId: string;
    maxUsers: number;
    isActive: boolean;
  };

  board: {
    type: "ROOM" | "PERSONAL";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string | null;
    roomId: string | null;
    title: string;
    isDefault: boolean;
    elements: JSON;
    appState: JSON | null;
  };
}

interface CreateRoomResponse {
  success: boolean;
  message: string;
  data: Data;
}

export default async function createRoom(
  createRoomData: CreateRoomInput
): Promise<CreateRoomResponse> {
  try {
    const res =
      await AxiosInstance.post<CreateRoomResponse>(
        "/api/v1/room/create",
        createRoomData
      );

    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to create room"
    );
  }
}