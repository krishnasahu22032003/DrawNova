export interface JoinRoomPayload {
  roomId: string;
}

export interface JoinRoomPayload {
  roomId: string;
}

export interface DrawShapePayload {
  roomId: string;

  shape: {
    id: string;
    type: "rectangle" | "circle" | "pencil";

    x: number;
    y: number;

    width?: number;
    height?: number;

    points?: number[];

    strokeColor?: string;
    fillColor?: string;

    createdBy: string;
  };
}