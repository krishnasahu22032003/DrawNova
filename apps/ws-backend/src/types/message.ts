export interface LeaveRoomPayload {
  roomId: string;
};

export interface JoinRoomPayload {
  roomId: string;
};

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
};

export interface UpdateShapePayload {
  roomId: string;

  shapeId: string;

  updates: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
};

export interface DeleteShapePayload {
  roomId: string;
  shapeId: string;
};

export interface CursorMovePayload {
  roomId: string;

  x: number;
  y: number;

  userId: string;
};

export interface ClearBoardPayload {
  roomId: string;
};