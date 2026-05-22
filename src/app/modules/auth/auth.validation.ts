import { z } from "zod";

const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    role: z.enum(["contributor", "maintainer"]).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(1, { message: "Password is required" }),
  }),
});

export const AuthValidation = {
  signupSchema,
  loginSchema,
};