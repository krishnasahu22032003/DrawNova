import { z } from "zod";

const RectangleElementSchema = z.object({
  id: z.string().min(1),
  type: z.literal("rectangle"),
  x: z.number().finite(),
  y: z.number().finite(),
  width: z.number().finite(),
  height: z.number().finite(),
});

const CircleElementSchema = z.object({
  id: z.string().min(1),
  type: z.literal("circle"),
  x: z.number().finite(),
  y: z.number().finite(),
  radius: z.number().finite(),
});

const LineElementSchema = z.object({
  id: z.string().min(1),
  type: z.literal("line"),
  startX: z.number().finite(),
  startY: z.number().finite(),
  endX: z.number().finite(),
  endY: z.number().finite(),
});

const ArrowElementSchema = z.object({
  id: z.string().min(1),
  type: z.literal("arrow"),
  startX: z.number().finite(),
  startY: z.number().finite(),
  endX: z.number().finite(),
  endY: z.number().finite(),
});

const TextElementSchema = z.object({
  id: z.string().min(1),
  type: z.literal("text"),
  x: z.number().finite(),
  y: z.number().finite(),
  text: z.string().max(5000),
});

const PencilElementSchema = z.object({
  id: z.string().min(1),
  type: z.literal("pencil"),
  points: z.array(
    z.object({
      x: z.number().finite(),
      y: z.number().finite(),
    })
  ).min(2),
});

export const ElementSchema = z.discriminatedUnion("type", [
  RectangleElementSchema,
  CircleElementSchema,
  LineElementSchema,
  ArrowElementSchema,
  TextElementSchema,
  PencilElementSchema,
]);

export const AppStateSchema = z.object({
  zoom: z.number().min(0.1).max(10),
  scrollX: z.number().finite(),
  scrollY: z.number().finite(),
  theme: z.enum(["light", "dark"]),
});

export const UpdateBoardSchema = z.object({
  elements: z.array(ElementSchema),
  appState: AppStateSchema,
});

export const boardSchema = z.object({
  boardId: z.string()
});

export type Element = z.infer<typeof ElementSchema>;
export type AppState = z.infer<typeof AppStateSchema>;
export type UpdateBoardInput = z.infer<typeof UpdateBoardSchema>;