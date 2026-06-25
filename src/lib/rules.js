import { z } from "zod";

// 1. REGISTER VALIDATION SCHEMe
export const RegisterFormScheme = z
  .object({
    email: z
      .string()
      .email({ message: "Please enter a valid email address" })
      .trim(),
    name: z.string().min(1, { message: "Name is required" }).trim(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
        message: "Password must contain at least one letter and one number",
      }),
    confirmPassword: z
      .string()
      .min(6, { message: "Please confirm your password" })
      .trim(),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

// 2. LOGIN VALIDATION SCHEMe
// Relaxed structural complexity constraints to prevent production lockouts
export const LoginFormScheme = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .trim(),
  password: z.string().min(1, { message: "Password field cannot be empty" }),
});

// 3. BLOG POST VALIDATION SCHEMe
export const BlogPostFormScheme = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" })
    .trim(),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters long" })
    .max(10000, { message: "Content must be at most 10000 characters long" })
    .trim(),
});
