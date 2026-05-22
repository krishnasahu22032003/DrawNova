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

