import { z } from "zod";

export const CreateRoomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Room name is required")
    .max(50, "Room name cannot exceed 50 characters")
    .optional()
    .default("Room"),

  maxUsers: z
    .number()
    .int("Max users must be an integer")
    .min(2, "Room must allow at least 2 users")
    .max(10, "Room cannot exceed 10 users")
    .optional()
    .default(3),
}).strict();

export type CreateRoomInput = z.infer<
  typeof CreateRoomSchema
>;