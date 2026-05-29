export type Shape =
  | RectangleShape
  | CircleShape
  | LineShape
  |ArrowShape ;
  
export interface RectangleShape {
  id: string;
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CircleShape {
  id: string;
  type: "circle";
  x: number;
  y: number;
  radius: number;
}

export interface LineShape {
  id: string;
  type: "line";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface ArrowShape {
  id: string;
  type: "arrow";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}