import { z } from "zod";
export const registerUserValidation = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters long"),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    phone: z.string().optional(),
});

export const loginUserValidation = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const verifyUserValidation = z.object({
    otp : z.string().length(6, "OTP must be 6 digits"),
});