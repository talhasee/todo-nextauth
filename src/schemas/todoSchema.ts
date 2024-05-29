import { z } from "zod";

export const todoSchema = z.object({
    content: z
        .string()
        .max(300, "Content must not be longer than 300 characters")
});