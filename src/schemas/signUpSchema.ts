import { z } from "zod";

export const signUpSchema = z.object({
    email: z    
        .string()
        .email({
            message: "Invalid email address"
        }),
    password: z
        .string()
        .min(6, "password must be atleast 6 characters")
});