import { z } from "zod";

export const ElementTypeSchema = z.enum([
  "rectangle",
  "ellipse",
  "diamond",
  "line",
  "arrow",
  "text",
  "freedraw",
]);

const BaseElementSchema = z.object({
  id: z.string().min(1),

  type: ElementTypeSchema,

  x: z.number().finite(),

  y: z.number().finite(),

  width: z.number().finite(),

  height: z.number().finite(),

  strokeColor: z.string().min(1),

  backgroundColor: z.string().min(1),

  strokeWidth: z.number().min(1).max(20),

  opacity: z.number().min(0).max(100),

  angle: z.number().finite(),

  createdAt: z.number().int().positive(),

  updatedAt: z.number().int().positive(),
});

export const RectangleElementSchema =
  BaseElementSchema.extend({
    type: z.literal("rectangle"),
  }).strict();

export const EllipseElementSchema =
  BaseElementSchema.extend({
    type: z.literal("ellipse"),
  }).strict();

export const DiamondElementSchema =
  BaseElementSchema.extend({
    type: z.literal("diamond"),
  }).strict();

export const TextElementSchema =
  BaseElementSchema.extend({
    type: z.literal("text"),

    text: z.string().max(5000),

    fontSize: z.number().min(8).max(300),

    fontFamily: z.string().min(1),

    textAlign: z.enum([
      "left",
      "center",
      "right",
    ]),
  }).strict();

const PointsSchema = z.array(
  z.tuple([
    z.number().finite(),
    z.number().finite(),
  ])
);

export const LineElementSchema =
  BaseElementSchema.extend({
    type: z.literal("line"),

    points: PointsSchema.min(2),
  }).strict();

export const ArrowElementSchema =
  BaseElementSchema.extend({
    type: z.literal("arrow"),

    points: PointsSchema.min(2),
  }).strict();

export const FreeDrawElementSchema =
  BaseElementSchema.extend({
    type: z.literal("freedraw"),

    points: PointsSchema,
  }).strict();

export const ElementSchema = z.discriminatedUnion(
  "type",
  [
    RectangleElementSchema,
    EllipseElementSchema,
    DiamondElementSchema,
    TextElementSchema,
    LineElementSchema,
    ArrowElementSchema,
    FreeDrawElementSchema,
  ]
);

export const AppStateSchema = z.object({
  zoom: z.number().min(0.1).max(10),

  scrollX: z.number().finite(),

  scrollY: z.number().finite(),

  theme: z.enum(["light", "dark"]),

  gridSize: z.number().min(1).max(200),

  viewBackgroundColor: z.string(),

  currentTool: z.enum([
    "selection",
    "rectangle",
    "ellipse",
    "diamond",
    "line",
    "arrow",
    "text",
    "freedraw",
  ]),
}).strict();

export const UpdateBoardSchema = z.object({
  elements: z.array(ElementSchema),

  appState: AppStateSchema,
}).strict();

export type Element = z.infer<
  typeof ElementSchema
>;

export type AppState = z.infer<
  typeof AppStateSchema
>;

export type UpdateBoardInput = z.infer<
  typeof UpdateBoardSchema
>;